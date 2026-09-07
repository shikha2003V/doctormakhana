import React, { useState, useEffect } from 'react';
import { googleSignIn, logoutGoogle, getAccessToken, setAccessToken, auth } from '../../lib/firebase';
import { googleDriveService, DriveFileItem } from '../../services/googleDriveService';
import { User } from 'firebase/auth';
import {
  HardDrive,
  CloudUpload,
  FileText,
  Trash2,
  ExternalLink,
  RefreshCw,
  LogOut,
  AlertCircle,
  X,
  Search,
  CheckCircle2,
  Download
} from 'lucide-react';

interface GoogleDriveManagerProps {
  isOpen: boolean;
  onClose: () => void;
  autoSaveData?: {
    title: string;
    filename: string;
    content: string;
  };
}

export const GoogleDriveManager: React.FC<GoogleDriveManagerProps> = ({
  isOpen,
  onClose,
  autoSaveData,
}) => {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [accessToken, setToken] = useState<string | null>(getAccessToken());
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [files, setFiles] = useState<DriveFileItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // File to delete confirmation state
  const [fileToDelete, setFileToDelete] = useState<DriveFileItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Preview file content
  const [previewFile, setPreviewFile] = useState<{ name: string; content: string } | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currUser) => {
      setUser(currUser);
      if (currUser && getAccessToken()) {
        setToken(getAccessToken());
        loadDriveFiles(getAccessToken()!);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isOpen && accessToken) {
      loadDriveFiles(accessToken);
    }
  }, [isOpen, accessToken]);

  const handleGoogleSignIn = async () => {
    setIsLoggingIn(true);
    setStatusMessage(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setToken(res.accessToken);
        setAccessToken(res.accessToken);
        setStatusMessage({ type: 'success', text: `Connected as ${res.user.displayName || res.user.email}!` });
        await loadDriveFiles(res.accessToken);

        if (autoSaveData) {
          await handleSaveAutoData(res.accessToken);
        }
      }
    } catch (err: any) {
      console.error('Google Sign In error:', err);
      setStatusMessage({
        type: 'error',
        text: err?.message || 'Failed to authenticate with Google Drive. Please try again.',
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutGoogle();
      setUser(null);
      setToken(null);
      setFiles([]);
      setStatusMessage({ type: 'info', text: 'Disconnected from Google Drive.' });
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const loadDriveFiles = async (token: string) => {
    setIsLoading(true);
    try {
      const driveFiles = await googleDriveService.listFiles(token);
      setFiles(driveFiles);
    } catch (err: any) {
      console.error('Error fetching drive files:', err);
      setStatusMessage({
        type: 'error',
        text: 'Failed to fetch files from Google Drive. Token may have expired. Please reconnect.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAutoData = async (token: string) => {
    if (!autoSaveData) return;
    setIsLoading(true);
    try {
      await googleDriveService.saveFile(token, autoSaveData.filename, autoSaveData.content, 'text/plain');
      setStatusMessage({
        type: 'success',
        text: `Successfully backed up "${autoSaveData.filename}" to your Google Drive!`,
      });
      await loadDriveFiles(token);
    } catch (err: any) {
      console.error('Save to Drive error:', err);
      setStatusMessage({
        type: 'error',
        text: err?.message || 'Failed to save file to Google Drive.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDeleteFile = async () => {
    if (!fileToDelete || !accessToken) return;
    setIsDeleting(true);
    try {
      await googleDriveService.deleteFile(accessToken, fileToDelete.id);
      setStatusMessage({
        type: 'success',
        text: `Deleted "${fileToDelete.name}" from your Google Drive.`,
      });
      setFileToDelete(null);
      await loadDriveFiles(accessToken);
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err?.message || 'Failed to delete file from Google Drive.',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePreviewFile = async (file: DriveFileItem) => {
    if (!accessToken) return;
    setIsPreviewLoading(true);
    try {
      const content = await googleDriveService.getFileContent(accessToken, file.id);
      setPreviewFile({ name: file.name, content });
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Could not load file preview.' });
    } finally {
      setIsPreviewLoading(false);
    }
  };

  const filteredFiles = files.filter((f) =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600/30 border border-teal-500/40 text-teal-400 flex items-center justify-center">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white leading-tight">Google Drive Storage</h3>
              <p className="text-xs text-slate-400">Save & manage invoices, receipts & backups</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {statusMessage && (
            <div
              className={`p-3.5 rounded-xl text-xs font-semibold flex items-center justify-between gap-2 border ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : statusMessage.type === 'error'
                  ? 'bg-rose-50 text-rose-800 border-rose-200'
                  : 'bg-blue-50 text-blue-800 border-blue-200'
              }`}
            >
              <div className="flex items-center gap-2">
                {statusMessage.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                {statusMessage.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                <span>{statusMessage.text}</span>
              </div>
              <button onClick={() => setStatusMessage(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* User Auth Section */}
          {!user || !accessToken ? (
            <div className="bg-gradient-to-br from-teal-50 to-emerald-50/50 border border-teal-100 rounded-2xl p-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-md text-teal-600 flex items-center justify-center mx-auto border border-teal-100">
                <HardDrive className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-black text-slate-900 text-base">Connect your Google Drive</h4>
                <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
                  Sync and backup your Doctor Makhana order invoices, receipts, and order histories directly to your personal Google Drive storage safely.
                </p>
              </div>

              {/* Official GSI Material Button */}
              <div className="pt-2 flex justify-center">
                <button
                  onClick={handleGoogleSignIn}
                  disabled={isLoggingIn}
                  className="inline-flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-700 font-bold px-6 py-3 rounded-xl border border-slate-300 shadow-sm hover:shadow transition-all disabled:opacity-50 text-sm"
                >
                  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5 shrink-0">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                  </svg>
                  <span>{isLoggingIn ? 'Connecting...' : 'Sign in with Google'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Connected Account Bar */}
              <div className="flex items-center justify-between bg-slate-50 border border-slate-200/80 p-3.5 rounded-xl">
                <div className="flex items-center gap-3">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="User Avatar" className="w-8 h-8 rounded-full border border-slate-300" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center text-xs">
                      {user.displayName ? user.displayName.charAt(0) : 'U'}
                    </div>
                  )}
                  <div>
                    <div className="font-extrabold text-slate-800 text-xs">
                      {user.displayName || 'Google Account'}
                    </div>
                    <div className="text-[11px] text-slate-500">{user.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => loadDriveFiles(accessToken)}
                    disabled={isLoading}
                    className="p-2 text-slate-600 hover:text-teal-700 hover:bg-slate-200/60 rounded-lg transition-colors"
                    title="Refresh Files"
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  </button>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold"
                    title="Disconnect Google Drive"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Auto-save callout if present */}
              {autoSaveData && (
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <CloudUpload className="w-5 h-5 text-amber-600 shrink-0" />
                    <div>
                      <div className="font-extrabold text-slate-900 text-xs">{autoSaveData.title}</div>
                      <div className="text-[11px] text-slate-600">File: {autoSaveData.filename}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSaveAutoData(accessToken)}
                    disabled={isLoading}
                    className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg transition-colors shrink-0"
                  >
                    {isLoading ? 'Saving...' : 'Save to Drive Now'}
                  </button>
                </div>
              )}

              {/* Files Search Bar */}
              <div className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-xl border border-slate-200">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search files in Google Drive..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none w-full"
                />
              </div>

              {/* Files List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-1">
                  <span>YOUR DRIVE FILES ({filteredFiles.length})</span>
                </div>

                {isLoading ? (
                  <div className="text-center py-8 text-xs text-slate-500 flex flex-col items-center gap-2">
                    <RefreshCw className="w-5 h-5 animate-spin text-teal-600" />
                    <span>Loading your files from Google Drive...</span>
                  </div>
                ) : filteredFiles.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold">No files found matching search.</p>
                    <p className="text-[11px] text-slate-400 mt-1">You can save receipts or order invoices here.</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {filteredFiles.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between bg-white hover:bg-slate-50 border border-slate-200 p-3 rounded-xl transition-colors text-xs"
                      >
                        <div className="flex items-center gap-3 overflow-hidden mr-2">
                          <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="overflow-hidden">
                            <div className="font-extrabold text-slate-800 truncate">{file.name}</div>
                            <div className="text-[10px] text-slate-400">
                              {file.createdTime
                                ? new Date(file.createdTime).toLocaleDateString()
                                : 'Google Drive File'}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => handlePreviewFile(file)}
                            className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Preview Content"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>

                          {file.webViewLink && (
                            <a
                              href={file.webViewLink}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-slate-100 rounded-lg transition-colors"
                              title="Open in Google Drive"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}

                          <button
                            onClick={() => setFileToDelete(file)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete file"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal (User Confirmation for Destructive Operation) */}
        {fileToDelete && (
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-slate-100 animate-scale-in">
              <div className="flex items-center gap-3 text-rose-600">
                <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">Delete File from Google Drive?</h4>
                  <p className="text-xs text-slate-500">This action cannot be undone.</p>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs font-medium text-slate-700">
                Are you sure you want to delete <span className="font-bold text-slate-900">"{fileToDelete.name}"</span> from your Google Drive storage?
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setFileToDelete(null)}
                  disabled={isDeleting}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteFile}
                  disabled={isDeleting}
                  className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors flex items-center gap-1.5"
                >
                  {isDeleting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  <span>Confirm Delete</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* File Preview Modal */}
        {previewFile && (
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4 border border-slate-100 animate-scale-in max-h-[80vh] flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="font-extrabold text-slate-900 text-sm truncate pr-2">{previewFile.name}</div>
                <button onClick={() => setPreviewFile(null)} className="p-1 text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-slate-900 text-emerald-400 p-4 rounded-xl font-mono text-xs overflow-y-auto flex-1 whitespace-pre-wrap">
                {previewFile.content}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setPreviewFile(null)}
                  className="px-4 py-2 text-xs font-bold bg-slate-800 text-white rounded-xl hover:bg-slate-700"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-medium">
            Doctor Makhana Google Drive Integration
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 text-white rounded-xl font-bold text-xs hover:bg-slate-700 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

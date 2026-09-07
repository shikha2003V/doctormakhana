export interface DriveFileItem {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
  createdTime?: string;
  size?: string;
  iconLink?: string;
}

export const googleDriveService = {
  /**
   * List files in Google Drive (filtering for app-created or doctor makhana files)
   */
  async listFiles(accessToken: string, queryFilter: string = ''): Promise<DriveFileItem[]> {
    try {
      const defaultQuery = "trashed = false";
      const q = queryFilter ? `${defaultQuery} and (${queryFilter})` : defaultQuery;
      
      const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
        q
      )}&fields=files(id,name,mimeType,webViewLink,createdTime,size,iconLink)&orderBy=createdTime desc&pageSize=50`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error?.message || 'Failed to fetch files from Google Drive');
      }

      const data = await response.json();
      return data.files || [];
    } catch (error) {
      console.error('Error listing Drive files:', error);
      throw error;
    }
  },

  /**
   * Save a file (e.g., invoice text or JSON) to Google Drive
   */
  async saveFile(
    accessToken: string,
    filename: string,
    content: string,
    mimeType: string = 'text/plain'
  ): Promise<DriveFileItem> {
    try {
      const metadata = {
        name: filename,
        mimeType: mimeType,
        description: 'Saved from Doctor Makhana App',
      };

      const boundary = '-------314159265358979323846';
      const delimiter = `\r\n--${boundary}\r\n`;
      const closeDelimiter = `\r\n--${boundary}--`;

      const multipartRequestBody =
        delimiter +
        'Content-Type: application/json\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        `Content-Type: ${mimeType}\r\n\r\n` +
        content +
        closeDelimiter;

      const response = await fetch(
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,webViewLink,createdTime,size',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': `multipart/related; boundary=${boundary}`,
          },
          body: multipartRequestBody,
        }
      );

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err?.error?.message || 'Failed to save file to Google Drive');
      }

      const savedFile = await response.json();
      return savedFile;
    } catch (error) {
      console.error('Error saving file to Drive:', error);
      throw error;
    }
  },

  /**
   * Download or get text content of a file
   */
  async getFileContent(accessToken: string, fileId: string): Promise<string> {
    try {
      const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to retrieve file content from Drive');
      }

      return await response.text();
    } catch (error) {
      console.error('Error getting file content:', error);
      throw error;
    }
  },

  /**
   * Delete file from Google Drive (MUST be called with user confirmation in UI)
   */
  async deleteFile(accessToken: string, fileId: string): Promise<boolean> {
    try {
      const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err?.error?.message || 'Failed to delete file from Google Drive');
      }

      return true;
    } catch (error) {
      console.error('Error deleting file from Drive:', error);
      throw error;
    }
  },
};

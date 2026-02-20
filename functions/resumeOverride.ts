/**
 * Resume Override for public/localStorage persistence
 * In cloud public mode, all resumes are stored locally in localStorage
 */
export const ResumeOverride = {
  async create(data) {
    try {
      const resumeData = {
        ...data,
        userId: "public",
        created_by: "public",
      };
      
      // Store in localStorage
      localStorage.setItem(`resume_public`, JSON.stringify(resumeData));
      
      return { ...resumeData, id: "public" };
    } catch (error) {
      console.error('Failed to create resume:', error);
      throw error;
    }
  },

  async update(id, data) {
    try {
      const resumeData = {
        ...data,
        userId: "public",
        updated_date: new Date().toISOString(),
      };
      
      // Update localStorage
      localStorage.setItem(`resume_public`, JSON.stringify(resumeData));
      
      return { ...resumeData, id: "public" };
    } catch (error) {
      console.error('Failed to update resume:', error);
      throw error;
    }
  },

  async list() {
    try {
      const stored = localStorage.getItem(`resume_public`);
      
      if (stored) {
        const resume = JSON.parse(stored);
        return [{ ...resume, id: "public" }];
      }
      
      return [];
    } catch (error) {
      console.error('Failed to list resumes:', error);
      return [];
    }
  },

  async get(id) {
    try {
      const stored = localStorage.getItem(`resume_public`);
      if (stored) {
        const resume = JSON.parse(stored);
        return { ...resume, id: "public" };
      }
      
      throw new Error('Resume not found');
    } catch (error) {
      console.error('Failed to get resume:', error);
      throw error;
    }
  },

  async delete(id) {
    try {
      localStorage.removeItem(`resume_public`);
      return { success: true };
    } catch (error) {
      console.error('Failed to delete resume:', error);
      throw error;
    }
  },
};
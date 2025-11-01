// API utility functions for fetching data from various endpoints

/**
 * Fetches blogs with optional pagination
 * @param page Page number for pagination
 * @param limit Number of items per page
 * @returns Blog data with pagination info
 */
export async function fetchBlogs(page = 1, limit = 10) {
  try {
    const response = await fetch(`/api/blogs?page=${page}&limit=${limit}`, {
      next: { revalidate: 60 } // Revalidate every 60 seconds
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch blogs');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching blogs:', error);
    throw error;
  }
}

/**
 * Fetches a single blog by ID
 * @param id Blog ID
 * @returns Blog data
 */
export async function fetchBlogById(id: string) {
  try {
    const response = await fetch(`/api/blogs/${id}`, {
      next: { revalidate: 60 }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch blog');
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching blog ${id}:`, error);
    throw error;
  }
}

/**
 * Fetches services with optional pagination
 * @param page Page number for pagination
 * @param limit Number of items per page
 * @returns Service data with pagination info
 */
export async function fetchServices(page = 1, limit = 10) {
  try {
    const response = await fetch(`/api/services?page=${page}&limit=${limit}`, {
      next: { revalidate: 60 }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch services');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
}

/**
 * Fetches a single service by ID
 * @param id Service ID
 * @returns Service data
 */
export async function fetchServiceById(id: string) {
  try {
    const response = await fetch(`/api/services/${id}`, {
      next: { revalidate: 60 }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch service');
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching service ${id}:`, error);
    throw error;
  }
}

/**
 * Fetches about us data
 * @returns About us data
 */
export async function fetchAboutData() {
  try {
    const response = await fetch('/api/about', {
      next: { revalidate: 300 } // Revalidate every 5 minutes
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch about data');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching about data:', error);
    throw error;
  }
}

/**
 * Fetches hero section data
 * @returns Hero section data
 */
export async function fetchHeroData() {
  try {
    const response = await fetch('/api/hero', {
      next: { revalidate: 300 }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch hero data');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching hero data:', error);
    throw error;
  }
}

/**
 * Generic function to fetch data from any API endpoint
 * @param endpoint API endpoint path
 * @param options Fetch options
 * @returns Response data
 */
export async function fetchFromAPI(endpoint: string, options = {}) {
  try {
    const response = await fetch(`/api/${endpoint}`, {
      ...options,
      next: { revalidate: 60 }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch from ${endpoint}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching from ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Posts data to an API endpoint
 * @param endpoint API endpoint path
 * @param data Data to post
 * @returns Response data
 */
export async function postToAPI(endpoint: string, data: any) {
  try {
    const response = await fetch(`/api/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to post to ${endpoint}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error posting to ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Updates data at an API endpoint
 * @param endpoint API endpoint path
 * @param data Data to update
 * @returns Response data
 */
export async function updateAPI(endpoint: string, data: any) {
  try {
    const response = await fetch(`/api/${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update ${endpoint}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error updating ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Deletes data at an API endpoint
 * @param endpoint API endpoint path
 * @returns Response data
 */
export async function deleteFromAPI(endpoint: string) {
  try {
    const response = await fetch(`/api/${endpoint}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete from ${endpoint}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error deleting from ${endpoint}:`, error);
    throw error;
  }
}
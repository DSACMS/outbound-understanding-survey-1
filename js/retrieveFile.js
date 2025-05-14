async function retrieveFile(filePath) { 
    try { 
        const cacheBuster = `?t=${Date.now()}`; 
        const response = await fetch(filePath + cacheBuster); 
        
        if (!response.ok) { 
            throw new Error(`Network response was not ok ${response.status}`); 
        } 
        
        return await response.json(); 
    } catch (error) { 
        console.error("There was a problem with the fetch operation:", { 
            filePath: filePath, 
            error: error.message 
        }); 
        
        try { 
            const absolutePath = new URL(filePath, window.location.href).href; 
            const fallbackResponse = await fetch(absolutePath + cacheBuster); 
            
            if (!fallbackResponse.ok) throw new Error(`Fallback failed`); 
            
            return await fallbackResponse.json(); 
        } catch (fallbackError) { 
            console.error("Fallback loading failed: ", fallbackError); 
            throw new Error(`Cannot load file at ${filePath}`); 
        } 
    } 
}
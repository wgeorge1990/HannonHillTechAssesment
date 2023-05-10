import React,{ useState, useEffect } from 'react';
import axios from 'axios';

const SavedUrlsManager = () => {
    const [urls, setUrls] = useState([]);
    const [currentUrl, setCurrentUrl] = useState('');
    const [editingIndex, setEditingIndex] = useState(null);
    const [isEditing, setIsEditing] = useState(false)

    const updateJspInputField = (url) => {
        document.getElementById('url').value = url;
    };

    useEffect(() => {
        // Add an event listener to the select element
        const select = document.getElementById('savedUrls');
        if (select) {
            select.addEventListener('change', (e) => updateJspInputField(e.target.value));
        }

         axios.get('/ProjectPropertiesGetUrls')
            .then(response => {
//                 setUrls(response.data);
//                 updateSelectOptions(response.data);
                console.log('response:', response)
                console.log('response.data:', response.data)

            })
            .catch(error => {
                console.error('Error fetching saved URLs:', error);
            });


        // Remove the event listener when the component unmounts
        return () => {
            if (select) {
                select.removeEventListener('change', (e) => updateJspInputField(e.target.value));
            }
        };
    }, []);

    useEffect(() => {

    },[])



    const updateSelectOptions = (urls) => {
        const jspUrlInput = document.getElementById('url').value = urls[urls.length - 1]
        const select = document.getElementById('savedUrls');
        select.innerHTML = '';
        urls?.forEach(url => {
            const option = document.createElement('option');
            option.value = url;
            option.text = url;
            select.appendChild(option);
        });
    };

    const addUrl = () => {
        axios.post('/ProjectPropertiesAddUrl', { url: currentUrl })
            .then(response => {
                setUrls(prevUrls => [...prevUrls, currentUrl]);
                resetInput();
                updateSelectOptions([...urls, currentUrl]);
                updateJspInputField(currentUrl); // update the JSP input field
            })
            .catch(error => {
                console.error('Error adding URL:', error);
            });
    };

    const updateUrl = (oldUrl, newUrl) => {
        axios.post('/ProjectPropertiesUpdateUrl', { oldUrl, newUrl })
            .then(response => {
                setUrls(prevUrls => prevUrls.map(url => url === oldUrl ? newUrl : url));
                updateSelectOptions(prevUrls => prevUrls.map(url => url === oldUrl ? newUrl : url));
                updateJspInputField(newUrl); // update the JSP input field
            })
            .catch(error => {
                console.error('Error updating URL:', error);
            });
    }

    const deleteUrl = index => {
        const urlToDelete = urls[index];
        axios.post('/ProjectPropertiesDeleteUrl', { url: urlToDelete })
            .then(response => {
                let newUrls = urls.filter((_, i) => i !== index);
                setUrls(newUrls);
                updateSelectOptions(newUrls);
                updateJspInputField(newUrls[0]); // update the JSP input field
            })
            .catch(error => {
                console.error('Error deleting URL:', error);
            });
    };

    const saveUrl = () => {
        if (currentUrl) {
            const oldUrl = urls[editingIndex];
            updateUrl(oldUrl, currentUrl);
            resetInput();
        }
    };

    const startEditing = index => {
        setCurrentUrl(urls[index]);
        setEditingIndex(index);
        setIsEditing(true);
    };

    const resetInput = () => {
        setCurrentUrl('');
        setEditingIndex(null);
        setIsEditing(false);
    };

   return (
     <>
       <h2>Saved URLs Manager</h2>
       <input
         type="text"
         value={currentUrl}
         onChange={(e) => setCurrentUrl(e.target.value)}
         placeholder="https://"
       />
       {isEditing ? (
         <button onClick={saveUrl}>Save</button>
       ) : (
         <button onClick={addUrl}>Add</button>
       )}
       {urls.map((url, index) => (
         <div key={index}>
           {url}
           <button onClick={() => startEditing(index)}>Edit</button>
           <button onClick={() => deleteUrl(index)}>Delete</button>
         </div>
       ))}
     </>
   );
}

export default SavedUrlsManager;
import React,{ useState, useEffect } from 'react';
import axios from 'axios';

const SavedUrlsManager = () => {
    const [urls, setUrls] = useState([]);
    const [currentUrl, setCurrentUrl] = useState('');
    const [editingIndex, setEditingIndex] = useState(null);
    const [isEditing, setIsEditing] = useState(false)

    useEffect(() => {
        axios.get('/ProjectPropertiesGetUrls')
            .then(response => {
                setUrls(response.data)
                updateSelectOptions(response.data)
            })
            .catch(error => {
                console.error('Error fetching URLs:', error);
            });
    }, []);

    const updateSelectOptions = (urls) => {
        const select = document.getElementById('savedUrls');
        select.innerHTML = '';
        urls.forEach(url => {
            const option = document.createElement('option');
            option.value = url;
            option.text = url;
            select.appendChild(option);
        });
    };

    const addUrl = () => {
        if (currentUrl && !urls.includes(currentUrl)) {
            axios.post('/ProjectPropertiesAddUrl', { url: currentUrl })
                .then(response => {
                    setUrls(prevUrls => [...prevUrls, currentUrl]);
                    resetInput();
                    updateSelectOptions([...urls, currentUrl]);
                })
                .catch(error => {
                    console.error('Error adding URL:', error);
                });
        }
    };

    const updateUrl = (oldUrl, newUrl) => {
        axios.post('/ProjectPropertiesUpdateUrl', { oldUrl, newUrl })
            .then(response => {
                setUrls(prevUrls => prevUrls.map(url => url === oldUrl ? newUrl : url));
                updateSelectOptions(prevUrls => prevUrls.map(url => url === oldUrl ? newUrl : url));
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
        <React.Fragment>
            <h2>Saved URLs Manager</h2>

            <input type="text"
                   value={currentUrl}
                   onChange={e => setCurrentUrl(e.target.value)}
                   placeholder="Enter a URL and click Add" />

            { isEditing
                ? (<button onClick={saveUrl}>Save</button>)
                : (<button onClick={addUrl}>Add</button>)
            }

           { urls.map((url, index) => (
               <div key={index}>
                   {url}
                   <button onClick={() => startEditing(index)}>Edit</button>
                   <button onClick={() => deleteUrl(index)}>Delete</button>
               </div>
           ))}

       </React.Fragment>
   );
};

export default SavedUrlsManager;
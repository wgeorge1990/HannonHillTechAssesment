import React,{ useState } from 'react';

const SavedUrlsManager = () => {
    // holds list of saved urls
    const [urls, setUrls] = useState(['https://test-stub-one.com/about']);

    // holds the current value of the input field
    const [currentUrl, setCurrentUrl] = useState('');

    // holds the index of the URL being edited
    const [editingIndex, setEditingIndex] = useState(null);

    // indicates whether component is in edit mode or not
    const [isEditing, setIsEditing] = useState(false)

    // Updates the urls sate to include url if it does not already exist,
    // and resets the url input field
    const addUrl = () => {
        if (currentUrl && !urls.includes(currentUrl)) {
            setUrls([...urls, currentUrl]);
            setCurrentUrl(''); // reset the input field
        }
    };

    // startEditing
    const startEditing = index => {
        setCurrentUrl(urls[index]);
        setEditingIndex(index);
        setIsEditing(true);
    };

    const saveUrl = () => {
        if (currentUrl && !urls.includes(currentUrl)) {
            setUrls(urls.map((url, index) => index === editingIndex ? currentUrl : url));
            resetInput();
        }
    };

    const resetInput = () => {
        setCurrentUrl('');
        setEditingIndex(null);
        setIsEditing(false);
    };

    // deleting a url
    const deleteUrl = index => {
        setUrls(urls.filter((_, i) => i !== index));
    };

    return (
        <React.Fragment>
            <h2>Saved URLs Manager</h2>

            <input type="text"
                   value={currentUrl}
                   onChange={e => setCurrentUrl(e.target.value)}
                   placeholder="Enter a URL and click Add" />

            { isEditing ? (
                <button onClick={saveUrl}>Save</button>
            ) : (
                <button onClick={addUrl}>Add</button>
            )}

            {/*  map out each saved url and edit/delete actions for each */}
            {urls.map((url, index) => (
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
import React,{ useState } from 'react';

const SavedUrlsManager = () => {
    // holds list of saved urls
    const [urls, setUrls] = useState([]);

    // holds the current value of the input field
    const [currentUrl, setCurrentUrl] = useState('');

    // Updates the urls sate to include url if it does not already exist,
    // and resets the url input field
    const addUrl = () => {
        if (currentUrl && !urls.includes(currentUrl)) {
            setUrls([...urls, currentUrl]);
            setCurrentUrl(''); // reset the input field
        }
    };

    // editing a url
    // TODO: implement


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
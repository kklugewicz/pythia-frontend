fetch('website_description.txt')
  .then(response => {
    // Check if the response is successful
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    // Read the response as text
    return response.text();
  })
  .then(data => {
    // Replace newline characters with HTML line breaks
    data = data.replace(/\n/g, '<br>');

    // Replace <b> tags with bold text
    data = data.replace(/(<b>)(.*?)(<\/b>)/g, '<strong>$2</strong>');

    // Manipulate the DOM to display the content of the .txt file
    document.getElementById('website_description').innerHTML = data;
  })
  .catch(error => {
    console.error('There was a problem fetching the .txt file:', error);
  });

import React, { useState, useEffect } from "react";
import Slider from "react-input-slider";
import "./App.css"; // Adjust the path if your CSS file is in a different directory

function App() {
  const [imageDescriptions, setImageDescriptions] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [descriptionIndex, setDescriptionIndex] = useState(0);

  useEffect(() => {
    console.log(process.env.PUBLIC_URL);
    fetch(process.env.PUBLIC_URL + "/images_descriptions.json")
      .then((response) => response.json())
      .then((data) => setImageDescriptions(data.image_descriptions))
      .catch((error) =>
        console.error("Error fetching image descriptions:", error)
      );
  }, []);

  const handleChangeImage = (index) => {
    setSelectedImageIndex(index);
    setDescriptionIndex(0); // Reset description index when changing image
  };

  // Get the current image's descriptions in the correct order
  const getDescription = (index) => {
    const description = imageDescriptions[index];
    return [
      description.alt,
      description.short,
      description.description,
      description.detailed,
    ];
  };

  // If the JSON data hasn't been loaded yet, return a loading state
  if (imageDescriptions.length === 0) {
    return <div>Loading...</div>;
  }

  function createMarkup(text) {
    const html = text.replace(/\n/g, "<br/>");
    return { __html: html };
  }

  const descriptions = getDescription(selectedImageIndex);

  return (
    <div className="App">
      <h1>Image Description Zoom</h1>
      <div className="info">
        <p>
          This is a prototype to illustrate descriptions of an image at a range
          of detail written by AI. Move the slider to increase the detail of the
          description.{" "}
          <small>
            src:
            <a
              target="_blank"
              href="https://unsplash.com/photos/man-wearing-black-jacket-fzcluHBur3o"
            >
              [1]
            </a>
            <a target="_blank" href="https://www.mdpi.com/2413-8851/3/2/64">
              [2]
            </a>
            <a target="_blank" href="https://www.moma.org/artists/4016">
              [3]
            </a>
            <a target="_blank" href="https://twitter.com/blakesamic">
              [4]
            </a>
          </small>
        </p>
      </div>

      <div className="controls">
        <div>
          {imageDescriptions.map((img, index) => (
            <img
              key={index}
              src={process.env.PUBLIC_URL + "/" + img.src}
              alt={img.alt}
              onClick={() => handleChangeImage(index)}
              style={{
                border:
                  selectedImageIndex === index ? "2px solid blue" : "none",
                cursor: "pointer",
                width: "100px",
                height: "100px",
              }}
            />
          ))}
        </div>
      </div>

      <div className="selected-content">
        <div className="selected-image-container">
          <img
            className="selected-image"
            src={
              process.env.PUBLIC_URL +
              "/" +
              imageDescriptions[selectedImageIndex].src
            }
            alt={descriptions[0]} // Using the alt text for the alt attribute
          />
        </div>

        <div className="description-text">
          <div className="slider-container">
            <input
              type="range"
              min="0"
              max="3"
              value={descriptionIndex}
              onChange={(e) =>
                setDescriptionIndex(parseInt(e.target.value, 10))
              }
            />
          </div>
          <div
            dangerouslySetInnerHTML={createMarkup(
              descriptions[descriptionIndex]
            )}
          ></div>
        </div>
      </div>
      <footer className="footer">
        <p>
          made by{" "}
          <a href="https://whichlight.com/" target="_blank">
            whichlight
          </a>{" "}
          at{" "}
          <a target="_blank" href="https://upstatement.com/">
            Upstatement
          </a>{" "}
          as part of the Discovery AI prototyping series.
        </p>
      </footer>
    </div>
  );
}

export default App;

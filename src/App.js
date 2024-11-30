import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// helper function to convert hex to RGB
const hexToRgb = (hex) => {
  const bigint = parseInt(hex.slice(1), 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
};

// helper function to calculate luminance
const getLuminance = ({ r, g, b }) => {
  // linearizing the values for r,g,b
  const linearize = (channel) =>
    channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);

  const rLin = linearize(r / 255);
  const gLin = linearize(g / 255);
  const bLin = linearize(b / 255);

  // applying a formula obtained from WCAG guides to determine luminance
  return 0.2126 * rLin + 0.7152 * gLin + 0.0722 * bLin;
};

// calculate contrast ratio
const getContrastRatio = (hex1, hex2) => {
  const lum1 = getLuminance(hexToRgb(hex1));
  const lum2 = getLuminance(hexToRgb(hex2));

  const L1 = Math.max(lum1, lum2); // L1 is the higher luminance
  const L2 = Math.min(lum1, lum2); // L2 is the lower luminance

  // adding 0.05 to help distinguish better and also avoid division by zero
  return (L1 + 0.05) / (L2 + 0.05);
};

const App = () => {
  // define states
  const [color1, setColor1] = useState('#000000'); // default for color1 is black
  const [color2, setColor2] = useState('#ffffff'); // default for color2 is white
  const [textType, setTextType] = useState('normal'); // normal, large, heading
  const [colorBlindSim, setColorBlindSim] = useState('none'); // none, deuteranomaly, protanomaly, tritanomaly, monochromacy
  const [severity, setSeverity] = useState(50); // severity of color blindness, default for slider is 50%
  const [contrastRatio, setContrastRatio] = useState(null); // store contrast ratio, starting as null
  const [requiredContrast, setRequiredContrast] = useState(4.5); // required contrast for normal text (WCAG defines as 4.5:1 for normal text)
  const [customText, setCustomText] = useState('This is a preview text'); // user-provided preview text, default text given

  // ref for live preview box
  const previewBoxRef = useRef(null);

  // update contrast ratio and required contrast based on user input
  useEffect(() => {
    const contrast = getContrastRatio(color1, color2);
    setContrastRatio(contrast);

    // adjust required contrast based on text type
    if (textType === 'normal') {
      setRequiredContrast(4.5);
    }
    else if (textType === 'large' || textType === 'heading') {
      setRequiredContrast(3.0); // WCAG requires lower contrast for large text, buttons, and headings
    }
  }, [color1, color2, textType]);

  // update live preview based on current settings
  const updateLivePreview = () => {
    const previewBox = previewBoxRef.current;
    const filterValue = severity / 100; // adjust filter strength based on severity

    let filterStyle = '';
    let fontSize = '16px'; // default font size for normal text

    // set font size based on type
    switch (textType) {
      case 'normal':
        fontSize = '16px';
        break;
      case 'large':
        fontSize = '24px';
        break;
      case 'heading':
        fontSize = '32px';
        break;
      default:
        break;
    }

    // determine filtering based on color blind type
    // values determined via prior knowledge and resources online
    if (colorBlindSim !== 'none') {
      switch (colorBlindSim) {
        case 'deuteranomaly':
          filterStyle = `contrast(${1 + 0.4 * filterValue}) saturate(${0.6 + 0.4 * filterValue}) hue-rotate(${90 * filterValue}deg)`;
          break;
        case 'protanomaly':
          filterStyle = `contrast(${1 + 0.4 * filterValue}) saturate(${0.5 + 0.5 * filterValue}) hue-rotate(${60 * filterValue}deg)`;
          break;
        case 'tritanomaly':
          filterStyle = `contrast(${1 + 0.4 * filterValue}) saturate(${0.6 + 0.4 * filterValue}) hue-rotate(${180 * filterValue}deg)`;
          break;
        case 'monochromacy':
          filterStyle = `grayscale(${100 * filterValue}%) contrast(${100 + 50 * filterValue}%)`;
          break;
        default:
          break;
      }
    }

    // update preview box params based on the inputs
    previewBox.style.color = color1;
    previewBox.style.backgroundColor = color2;
    previewBox.style.filter = filterStyle;
    previewBox.style.fontSize = fontSize;
  };

  // update live preview on every state change
  useEffect(() => {
    updateLivePreview();
  }, [color1, color2, colorBlindSim, severity, textType, customText]);

  // copy hex codes to clipboard
  const copyHexCodes = () => {
    const textToCopy = `Color 1: ${color1}, Color 2: ${color2}`; // format for copying
    navigator.clipboard.writeText(textToCopy).then(() => {
      alert('Hex codes copied to clipboard!'); // send an alert on the device itself
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  // reset color inputs and settings
  const resetDefaults = () => {
    setColor1('#000000');
    setColor2('#ffffff');
    setTextType('normal');
    setColorBlindSim('none');
    setSeverity(50);
    setCustomText('This is a preview text');
  };

  // swap text and background colors
  const swapColors = () => {
    setColor1((prevColor1) => {
      const temp = color2;
      setColor2(prevColor1);
      return temp;
    });
  };


  // HTML code defining structure of the app
  return (
    <div className="app-container">
      <h1>
        Palette Perception: Accessibility & Color Contrast Tool
      </h1>

      <main>
        <section className="form-section">
          {/* Color inputs for text and background */}
          <h2>Settings</h2>
          <div className="color-picker">
            <label>Text Color: </label>
            <input
              type="color"
              value={color1}
              onChange={(e) => setColor1(e.target.value)}
              aria-label="Select text color"
            />
            <label>Background Color: </label>
            <input
              type="color"
              value={color2}
              onChange={(e) => setColor2(e.target.value)}
              aria-label="Select background color"
            />
          </div>
          <button id={"swap-button"} onClick={swapColors}>Swap Text and Background</button>
          {/* Dropdown to select text type */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="textType">Text Type:</label>
              <select
                id="textType"
                value={textType}
                onChange={(e) => setTextType(e.target.value)}
              >
                <option value="normal">Body</option>
                <option value="large">Small Heading</option>
                <option value="heading">Large Heading</option>
              </select>
            </div>
          
          {/* Display of contrast ratio and whether it meets WCAG standards or not */}
          <div className="form-group">
            <p id="contrast-ratio">
              Contrast Ratio: <span id="contrastValue">
                {contrastRatio ? `${contrastRatio.toFixed(2)}` : 'N/A'}
              </span>
              <br />
              <span style={{ fontWeight: 'bold', color: contrastRatio && contrastRatio >= requiredContrast ? 'green' : 'red' }} >
                {contrastRatio ? (contrastRatio >= requiredContrast ? 'Passes requirements' : 'Fails requirements') : ''}
              </span>
            </p>
          </div>

            {/* Dropdown to select color blindness type */}
            <div className="form-group">
              <label htmlFor="colorBlindSim">Simulate Color Blindness:</label>
              <select
                id="colorBlindSim"
                value={colorBlindSim}
                onChange={(e) => setColorBlindSim(e.target.value)}
              >
                <option value="none">None</option>
                <option value="deuteranomaly">Deuteranomaly</option>
                <option value="protanomaly">Protanomaly</option>
                <option value="tritanomaly">Tritanomaly</option>
                <option value="monochromacy">Monochromacy</option>
              </select>
            </div>
          </div>

          {/* Slider to determine color blindness severity */}
          <div className="form-group">
            <label htmlFor="severity">Color Blindness Severity: </label>
            <span id="severityValue">{`${severity}%`}</span>
            <input
              type="range"
              id="severity"
              min="0"
              max="100"
              value={severity}
              onChange={(e) => setSeverity(Number(e.target.value))}
              disabled={colorBlindSim === 'none'} // disable slider when "None" is selected in "Simulate Color Blindness"
            />
          </div>

          {/* Allow for resetting settings*/}
          <div className="form-group">
            <button id="reset-button" onClick={resetDefaults}>Reset</button>
          </div>
        </section>

        <section className="preview-section">
          {/* Live preview of color and text changes */}
          <h2>Live Preview</h2>
          <div ref={previewBoxRef} id="previewBox">
            <p>{customText}</p>
          </div>

          {/* Textbox to enter custom text for preview */}
          <div className="form-group">
            <label htmlFor="customText">Custom Preview Text: </label>
            <input
              type="text"
              id="customText"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)} // update state with custom text
              maxLength={60} // 60 characters max
            />
            <small>{`    ${customText.length}/60 characters`}</small> {/* Display character count */}
          </div>

          {/* Allow for copying palette hex codes */}
          <div className='form-group'>
            <button id="copy-button" onClick={copyHexCodes}>Copy Hex Codes</button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;

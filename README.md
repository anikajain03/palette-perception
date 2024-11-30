# Palette Perception: Accessibility & Color Contrast Tool

*Palette Perception* is an interactive web application designed to enhance accessibility in design by evaluating color contrast and simulating color blindness. The tool ensures compliance with WCAG standards and provides real-time previews to help designers create inclusive color schemes. *Palette Perception* was designed for the purpose of the Software Structures For User Interfaces (SSUI) class at Carnegie Mellon University (CMU).


## Installation

1. **Clone the Repository**  
   ```bash
   git clone https://github.com/yourusername/palette-perception.git
   ```
   
2. **Navigate to the Project Directory**  
   ```bash
   cd palette-perception
   ```

4. **Run the Application**  
   Make sure you have [Node.js](https://nodejs.org/) installed. Start the development server:  
   ```bash
   npm start
   ```

5. **Access the Application**  
   Open your browser and navigate to:  
   ```
   http://localhost:3000
   ```

## Usage

- **Choose Colors**  
  Use the color pickers to select text and background colors.
  
- **Evaluate Contrast**  
  Check the displayed contrast ratio and whether it passes WCAG standards. Modify the text type (normal, small heading, or ;arge heading) to test different accessibility thresholds.

- **Simulate Color Blindness**  
  Select a color blindness type from the dropdown, and adjust the severity using the slider.

- **Live Preview Changes**  
  View simulated changes directly in the preview section. Customize the text to better see how your design would look.

- **Custom Text Preview**  
  Allows users to input custom text for live accessibility evaluation.

- **Save and Reset**  
  Copy the selected hex codes using the **Copy Hex Codes** button. Reset all settings to defaults with the **Reset** button.

## Technologies Used

- **React.js**  
  For building the user interface and managing state.

- **CSS**  
  For responsive and visually appealing styling.

- **WCAG Guidelines**  
  Contrast calculations and accessibility standards based on the [Web Content Accessibility Guidelines](https://www.w3.org/WAI/standards-guidelines/wcag/).

## Contact

For questions or feedback, feel free to reach out to:  
### Anika Jain
[LinkedIn](https://www.linkedin.com/in/anikaj2/) | [Email](anikajai@andrew.cmu.edu) | [Portfolio](https://anikaj2.notion.site/)
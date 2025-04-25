# South Bend Visualization In Mapbox
This project is my submission for the Spherical Software Engineering Internship Challenge. The purpose of this project is to display a Mapbox map centered somewhere meaningful to me and allow the user to place pins with descriptions on the map. I chose my hometown, South Bend, Indiana.

**Link to project:** https://mapbox-southbend-spherical-app.vercel.app/

![image](https://github.com/user-attachments/assets/4adbe48d-fdb6-4e12-a996-913e2784cb6e)

![image](https://github.com/user-attachments/assets/88a1cc2f-bf6e-4f0d-9481-aacc2a4fdc38)

![image](https://github.com/user-attachments/assets/b2a5170d-90a4-49bd-ace6-71618676457c)

## How It's Made:

**Tech used:** Vite, React, Mapbox API

### Features:
+ Map Initialization and State Management
  * How it works:
    - The app initializes a Mapbox GL map centered at a defined location and zoom.
    - It tracks the map's center and zoom in React state, updating them as the user pans/zooms.

  * Implementation:
    - `mapRef` holds the Mapbox map instance.
    - `mapContainerRef` is attached to the map's `<div>`.
    - The `useEffect` with an empty dependency array (`[]`) initializes the map once and registers a `move` listener to update React state (`center`, `zoom`) whenever the map is moved.
    - This state is displayed in the sidebar.

+ Persistent Pins (Markers) with Descriptions
  * How it works:
    - The user can add pins (markers) to the map by clicking.
    - Each pin has a user-supplied description.
    - Pins persist across page reloads using `localStorage`.

  * Implementation:
    - The `markers` state stores an array of pin objects (`{ lng, lat, description }`).
    - On mount, a `useEffect` loads existing markers from `localStorage` (if any).
    - When a new pin is added (see next section), both state and `localStorage` are updated.
    - Another `useEffect` is responsible for rendering the Mapbox markers on the map whenever `markers` changes, and for cleaning up old markers.

+ Add Pins Mode (Toggleable)
  * How it works:
    - The user toggles “Add Pins” mode with a button.
    - In “Add Pins” mode, clicking the map opens a prompt for a description, and then drops a marker at that location.

  * Implementation:
    - `canAddPins` is a state boolean. When true, the app registers a click handler on the map.
    - The click handler:
      - Gets the clicked coordinates.
      - Prompts the user for a description.
      - Updates the `markers` state and `localStorage`.
    - The handler is registered or unregistered every time `canAddPins` changes, using a dedicated `useEffect`.
  * Safety: 
    - The "Add Pins" button is disabled while "Delete Pins" mode is active, preventing mode conflicts.

+ Delete Pins Mode (Toggleable)
  * How it works:
    - The user toggles “Delete Pins” mode with a button.
    - In “Delete Pins” mode, clicking any marker deletes it.

  * Implementation:
    - `canDeletePins` is a state boolean. When true, each marker's DOM element gets a click handler attached:
      - Clicking the marker removes it from the `markers` state (and `localStorage`).
    - When `canDeletePins` is false, the click handler is removed and the marker’s cursor style is reset.
    - This logic is handled in the marker-rendering `useEffect`, which depends on both `markers` and `canDeletePins`.

  * Safety:  
    - The "Delete Pins" button is disabled while "Add Pins" mode is active, preventing conflicts.
    - The marker’s cursor changes to `pointer` to give visual feedback when deletable.

+ Reset Map View
  * How it works:  
    - The “Reset View” button smoothly returns the map to its initial center, zoom, bearing, and pitch.

  * Implementation:
    - Clicking “Reset View” calls `flyTo` on the map instance with all properties reset.

+ UI Layout and Sidebar
  * How it works:
    - The sidebar shows current map center/zoom.
    - Buttons for adding, deleting, and resetting pins are clearly accessible.

  * Implementation:
    - The sidebar `<div className="sidebar">` displays the current map position and all controls.
    - The main map `<div id='map-container' ... />` fills the viewport behind/next to the sidebar.
    - Styling (e.g., button color) reflects the active mode for user feedback.

+ Additional Considerations
  * Marker Management:
    - `markerRefs` holds references to the live Mapbox marker objects, so they can be removed from the map before re-rendering, preventing marker duplication.

  * Cleanup:
    - All event handlers and markers are cleaned up (removed) as appropriate to avoid memory leaks or stale handlers.

## My Process and Lessons Learned:

Starting this project, I had no understanding of Mapbox or its capabilities. I only had a rough understanding of the API and how it works from a small bit of research I had done in the interview process with Spherical. Initially, I was having trouble choosing a good framework. Looking at the Mapbox documentation, it seemed like React + Vite was the way to go and I followed a basic tutorial to get started with Mapbox. While I have worked with React previously, I felt that this project gave me an opportunity to work with typescript and React in a completely different way. I had initially struggled with the pin placing implementation, because the documentation assumes the developer is using javascript and there are small changes I had to made to adapt to typescript. Overall, Mapbox was generally straightforward to work with, and it allowed me to learn how to integrate my previous experience with web development with the features that Mapbox provided.

Mid-development, I showed my product to a few friends. This definitely helped me figure out small things with the user interface that didn't quite speak to those not familiar with the purpose of the project. For example, a small but important change was changing the "Reset" button to "Reset View" to ensure clarity that the reset was for the map view and not to clear all pins that were placed. I also was trying to think of myself as a user as much as I could, and that's why I decided to use the "Add Pins" and "Delete Pins" buttons. Originally, it would always allow the user to place pins when they clicked the map. I, as a user, was struggling to maneuver the map without prompting the pin to place, so I decided that a button that designates when pins can be placed would be the best fix to the issue.

Mapbox is a very powerful tool, and as I was finishing up this project, I was doing research into the other capabilities of Mapbox. One that really stuck out to me was the heatmaps option, and while out of the scope of this project, I feel that implementing a heatmap for emissions, natural disasters, and other major considerations in a city would be a great addition to this project. Otherwise, I am glad I got to work with Mapbox, and I learned a lot working on this project.



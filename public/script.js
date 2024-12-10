// Fetch and display events
fetch('http://localhost:3000/dbevents')
    .then(response => response.json())
    .then(events => {
        const tableBody = document.getElementById('events-table');
        events.forEach(event => {
            const row = `
                <tr>
                    <td>${event.date || 'N/A'}</td>
                    <td>${event.time || 'N/A'}</td>
                    <td>${event.sport || 'N/A'}</td>
                    <td>${event.venue || 'N/A'}</td>
                    <td>${event.team1 || 'N/A'} vs ${event.team2 || 'N/A'}</td>
                    <td>${event.description || 'N/A'}</td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    })
    .catch(error => {
        console.error('Error fetching events:', error);
        alert('Failed to fetch events. Check the console for more details.');
    });

// Populate dropdowns for teams
fetch('http://localhost:3000/teams')
    .then(response => response.json())
    .then(teams => {
        const awayTeamDropdown = document.getElementById('away_team');
        teams.forEach(team => {
            const option = document.createElement('option');
            option.value = team.id;
            option.textContent = team.name;
            awayTeamDropdown.appendChild(option);
        });
    });

// Initialize Flatpickr on the date and time input fields
flatpickr("#date", {
    enableTime: false, // Only date picker (no time)
    dateFormat: "Y-m-d", // Format the date as Year-Month-Day
    minDate: "today", // Disable past dates
});

flatpickr("#time", {
    enableTime: true, // Enable time picker
    noCalendar: true, // Disable calendar
    dateFormat: "H:i", // Time format (24-hour)
    time_24hr: true, // Enable 24-hour format
});

// Handle new event submission
document.getElementById('add-event-form').addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = {
        date: document.getElementById('date').value,
        time: document.getElementById('time').value,
        away_team: document.getElementById('away_team').value,
    };

    fetch('http://localhost:3000/add-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
    })
        .then(response => {
            if (!response.ok) throw new Error('Failed to add event');
            alert('Event added successfully!');
            window.location.reload(); // Reload to display the new event
        })
        .catch(error => {
            console.error('Error adding event:', error);
            alert('Failed to add event. Check the console for more details.');
        });
});


// Fetch a specific event when button is clicked
document.getElementById('fetch-event-btn').addEventListener('click', () => {
    const eventId = prompt("Enter Event ID to fetch:"); // Prompt user to enter event ID

    if (eventId) {
        fetch(`http://localhost:3000/event/${eventId}`)
            .then(response => response.json())
            .then(event => {
                if (event) {
                    const tableBody = document.getElementById('event-table-body');
                    const row = `
                        <tr>
                            <td>${event.date || 'N/A'}</td>
                            <td>${event.time || 'N/A'}</td>
                            <td>${event.sport || 'N/A'}</td>
                            <td>${event.venue || 'N/A'}</td>
                            <td>${event.team1 || 'N/A'} vs ${event.team2 || 'N/A'}</td>
                            <td>${event.description || 'N/A'}</td>
                        </tr>
                    `;
                    tableBody.innerHTML = row;  // Update the table with event data
                    document.getElementById('event-table').style.display = 'block'; // Show the table
                } else {
                    alert('Event not found!');
                }
            })
            .catch(error => {
                console.error('Error fetching event:', error);
                alert('Failed to fetch event. Check the console for more details.');
            });
    }
});

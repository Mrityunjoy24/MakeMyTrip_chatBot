# MakeMyTrip_Demo_Bot

ChatBot called MakeMyTrip that helps the user plan their trip by booking flights, booking rooms in a hotel in the destination city, book cars.
 
Before making a booking, it asks for the user's email, phone number.
 
For booking flight
Bot accept the source, destination city and date of flight.
It gives multiple time slots available for the particular date requested.
It also ask if the user wants to make the round trip booking
 
For booking rooms in hotel
There are multiple hotels to select from. Show the starting price of rooms when showing hotel names.
There are multiple types of rooms to select from, for example: deluxe room, economy, suite etc with different price ranges
Bot ask no of people (adults and children) for whom the booking is to be made. There should be a limit of 2 adults per room. (not more than 2 children allowed per room)
Before making the booking, it shows user the total amount to be paid for the room selected.
If the user agrees, booking is done else it asks them to choose another types of hotel or room type to make a booking,
 
For booking cars
It Accept the car brand
It Accept the car type - sedan, minivan, convertible, crossover etc
IT Accept the duration for which the car is to be booked
Before making the booking,it shows the user the total amount to be paid for the car selected.
If the user agrees, booking is done else it asks them to choose another car type or brand to make a booking.
 

Once booking is done for all three cases,an automated mail sent to the user's email containing the invoice.
All dynamic data and validation logic are in webhook along with the email functionality.


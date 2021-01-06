/**
 * Copyright 2020 Quantiphi, Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

"use strict";

/**
 * Default Welcome Intent controller
 * @param {object} df webhook fulfillment object
 */

const db = require("../../helper/dbconnectivity");
const flightBooking = async (df) => {

    let contexts = df._request.queryResult.outputContexts;
    let agent = contexts.find(item => item.name.endsWith('/contexts/awaiting_service'));
    var date = agent.parameters["date"].split("T")[0];
    var result = []
    var source = agent.parameters["source_city"];
    var destination = agent.parameters["destination_city"];
    var email = agent.parameters['email'];
    await db.collection("users").doc(email).update({
        'source': source,
        'destination': destination,
        'date': date
    });
    const snapshot=await db.collection('Flights').get();

    snapshot.forEach((doc) => {
        if (doc.data().date == date && doc.data().source == source && doc.data().destination == destination) {
            result.push(doc.data().time);
        }
    });
    if (result.length == 0) {
        df.setResponseText("NO Time slots available for " + date +" "+ source + " to " + destination
            + ":" + " Please choose another date.");
    }
    else {
        df.setResponseText("Time slots available for " + date +" "+ source + " to " + destination
            + ":" );
        result.forEach(element=>{
            df.setResponseText(element + "(IST)." );
        })

        df.setResponseText( " Please choose a time slot.");
        
    }

};

module.exports = flightBooking;
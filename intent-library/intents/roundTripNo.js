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
const roundTripNo = async (df) => {

    let contexts = df._request.queryResult.outputContexts;
    let agent = contexts.find(item => item.name.endsWith('/contexts/awaiting_service'));
    var email = agent.parameters['email'];
    var date = agent.parameters['date'].split("T")[0];
    var time = agent.parameters['time'].split("T")[1].split("+")[0];
    var up = "Flight booking summery:"
    await db.collection('users').doc(email).get()
        .then(async (doc) => {
            var source = doc.data().source;
            var destination = doc.data().destination;
            up += date + " " + time + " " + source + " to " + destination

        });
    await db.collection('Flights').get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                if (doc.data().date == date && doc.data().time == time) {
                    var flightno = doc.data().flightid;
                    var flightname = doc.data().name;
                    var price = doc.data().price;
                    up += flightno + flightname + price;
                }
            });
        });
    await db.collection("users").doc(email).update({
        'flight': up
    });
    df.setResponseText(up);
    df.setResponseText("Do you want hotels");


};
module.exports = roundTripNo;
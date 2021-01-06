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
const getDetails = async (df) => {

    let contexts = df._request.queryResult.outputContexts;
    let agent = contexts.find(item => item.name.endsWith('/contexts/awaiting_service'));


    var user_details = { 'useremail': agent.parameters["email"], 'phonenumber': agent.parameters["phone-number"] };
    db.collection('users').doc(agent.parameters["email"]).set(user_details);
    
    //console.log(df._request);
    df.setResponseText("Got it.  Which service do you want ? 1. Flight booking  2. Hotel Booking 3. Car booking");
};

module.exports = getDetails;
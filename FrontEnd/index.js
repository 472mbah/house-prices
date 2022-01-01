const HTTP = new XMLHttpRequest();
const host = "http://127.0.0.1:5000"
const predict_end_point = "predict_home_prices"
const meta_end_point = "retrieve-meta"
const load_url = `${host}/${meta_end_point}`
const predict_url = `${host}/${predict_end_point}`
const one_pound_lakh_equivalent = 100.19839281777921
/*

    "availability"
    "size"
    "total_sqft"
    "bath"
    "balcony"
    "area"
    "location"

0: "area_type_Carpet"
1: "area_type_Plot"
2: "area_type_Super_built-up"

0: "location_Kanakpura"
1: "location_Sarjapur"
2: "location_Thanisandra"
3: "location_Whitefield"
4: "location_Yelahanka"
5: "location_other"

*/

const get_predictions = (params) => {

    if (!params.length) return -1;

    HTTP.open('POST', predict_url)
    HTTP.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    HTTP.setRequestHeader('Access-Control-Allow-Origin', '*')

    HTTP.onreadystatechange = function () {
        // In local files, status is 0 upon success in Mozilla Firefox
        if(HTTP.readyState === XMLHttpRequest.DONE) {
          var status = HTTP.status;
          if (status === 0 || (status >= 200 && status < 400)) {
            // The request has been completed successfully
            if (HTTP.responseText.length) {
                let data = JSON.parse(HTTP.responseText)
                // console.log(data);
                output_user_prediction(data.predicted_price)    
            }
            // initialise_interface(columns)

        } else {
            // Oh no! There has been an error with the request!
          }
        }
      };

    HTTP.send(params)
}

const load_meta_information = () => {
    HTTP.open('GET', load_url)

    HTTP.setRequestHeader('Access-Control-Allow-Origin', '*')
    HTTP.setRequestHeader('Access-Control-Request-Method', 'GET')
    HTTP.setRequestHeader('Access-Control-Request-Headers', 'X-PINGOTHER')
    

    HTTP.onreadystatechange = function () {
        // In local files, status is 0 upon success in Mozilla Firefox
        if(HTTP.readyState === XMLHttpRequest.DONE) {
          var status = HTTP.status;
          if (status === 0 || (status >= 200 && status < 400)) {
            // The request has been completed successfully
            let columns = JSON.parse(HTTP.responseText)
            initialise_interface(columns)

        } else {
            // Oh no! There has been an error with the request!
          }
        }
      };
    HTTP.send()
}

const initialise_interface = data => {
    console.log(data)
    // alert('initialising information')
}

const convert_date_to_timeStamp = date => {
    return Date.parse(date)
}

const manage_form_input_errors = (message) => {
    message && alert(message)
}


const convert_results_into_form_format = results => {
    
    let out = "";

    for (let key in results) {
        let v = results[key];
        out += `${key}=${v}&`
    }

    out.length && (out = out.replace(/&$/, ''))

    return out;

    
}

const authorise_items = () => {

    let el = document.querySelector('#main_form')
    if (!el) {
        alert('something misterious happened')
        return
    };

    let results = {};
    let string_inputs = ['area', 'location'];
    let date_inputs = ['availability'];

    var formData = new FormData(el)
    for (var p of formData.entries()) {
        let [field, value] = p;


        if (value.length) {
            if (string_inputs.includes(field)) 
                results[field] = value
            else if (date_inputs.includes(field))
                results[field] = convert_date_to_timeStamp(value)
            else 
                results[field] = parseInt(value)
        
        }
        
        
        else {
            manage_form_input_errors("Invalid date")
            return;
        }



    }

    let formated_results = convert_results_into_form_format(results)
    // console.log(formated_results)
    get_predictions(formated_results)


}


const convert_into_pounds = (lakhs) => {
    return Math.trunc(one_pound_lakh_equivalent * lakhs); 
}

const output_user_prediction = (price) => {
    let result = document.getElementById('result')
    if (price===-1) {alert("something went wrong when predicting"); return}; 
    let message = `Predicted price is ${price} Lakh, which is equivalent to ~ £${convert_into_pounds(price)}`
    if (!result){ 
        alert(message)
        return;
    }
    else 
        result.innerText = message
}



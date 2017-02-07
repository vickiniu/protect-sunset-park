var google;

const allCouncilEmails = `
info38@council.nyc.gov,
mguerra@council.nyc.gov,
district2@council.nyc.gov,
speakerjohnson@council.nyc.gov,
kpowers@council.nyc.gov,
bkallos@council.nyc.gov,
helen@helenrosenthal.com,
district7@council.nyc.gov,
dayala@council.nyc.gov,
d09perkins@council.nyc.gov,
yrodriguez@council.nyc.gov,
district11@council.nyc.gov,
andy.king@council.nyc.gov,
MGjonaj@council.nyc.gov,
fcabrera@council.nyc.gov,
Rtorres@council.nyc.gov,
District16Bronx@council.nyc.gov,
salamanca@council.nyc.gov,
RDiaz@council.nyc.gov,
district19@council.nyc.gov,
pkoo@council.nyc.gov,
FMoya@council.nyc.gov,
nroloson@council.nyc.gov,
nwidzowski@council.nyc.gov,
BGrodenchik@council.nyc.gov,
RLancman@council.nyc.gov,
dromm@council.nyc.gov,
arasoulinejad@council.nyc.gov,
bclarke@council.nyc.gov,
Adams@council.nyc.gov,
JWilkerson@council.nyc.gov,
KMooney@council.nyc.gov,
Koslowitz@council.nyc.gov,
District30@council.nyc.gov,
dkurzyna@council.nyc.gov,
swong@council.nyc.gov,
drichards@council.nyc.gov,
msilva@council.nyc.gov,
bscott@council.nyc.gov,
eulrich@council.nyc.gov,
LCumbo@council.nyc.gov,
district36@council.nyc.gov,
meugene@council.nyc.gov,
District41@council.nyc.gov,
jsimmons@council.nyc.gov,
mwashington@council.nyc.gov,
AskJB@council.nyc.gov,
AskKalman@council.nyc.gov,
District45@council.nyc.gov,
SPierre@council.nyc.gov,
HNolasco@council.nyc.gov,
AMaisel@council.nyc.gov,
MTreyger@council.nyc.gov,
cdeutsch@council.nyc.gov,
DROSE@Council.nyc.gov,
SMatteo@council.nyc.gov,
borelli@council.nyc.gov,
cojo63@gmail.com,
ydanisrodriguez@hotmail.com,
AndyJCohen@optonline.net,
councilmanandyking@gmail.com,
mcarroyo17@yahoo.com,
peterkoo88@gmail.com,
daneek7@hotmail.com,
stephenlevin9@yahoo.com,
cornegyr@yahoo.com,
inezdbarron@aol.com,
ben@benkallos.com,
prosunsetpark@gmail.com`;

var autocomplete;

function initMap() {
  var input = document.getElementById("address");
  var nycBounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(40.58, -73.8),
    new google.maps.LatLng(40.9176, -74.15)
  );

  autocomplete = new google.maps.places.Autocomplete(input, {
    bounds: nycBounds
  });

  // Bind the map's bounds (viewport) property to the autocomplete object,
  // so that the autocomplete requests use the current map bounds for the
  // bounds option in the request.
  // autocomplete.bindTo("bounds", map);

  // Set the data fields to return when the user selects a place.
  autocomplete.setFields(["address_components"]);
}

function submit() {
  // Check validity of inputs (hack to avoid the reload on form submit in Safari)
  var nameInput = document.getElementById("name");
  if (!nameInput.checkValidity()) {
    nameInput.reportValidity();
    return false;
  }
  var neighborhoodInput = document.getElementById("neighborhood");
  if (!neighborhoodInput.checkValidity()) {
    neighborhoodInput.reportValidity();
    return false;
  }
  var addressInput = document.getElementById("address");
  if (!addressInput.checkValidity()) {
    addressInput.reportValidity();
    return false;
  }
  var place = autocomplete.getPlace();
  if (!place || !place.address_components) {
    document.getElementById(
      "error"
    ).innerHTML = `<p>Sorry, we were unable to find your council member at the address given.</p>`;
    return false;
  }

  var houseNumber, street, zip;
  for (var component of place.address_components) {
    if (component.types.includes("street_number")) {
      houseNumber = component.short_name;
    }
    if (component.types.includes("route")) {
      street = component.short_name;
    }
    if (component.types.includes("postal_code")) {
      zip = component.short_name;
    }
  }
  fetch("https://cryptic-everglades-83815.herokuapp.com/council-info", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      house_number: houseNumber,
      street: street,
      zip: zip
    })
  }).then(resp => {
    resp.json().then(data => {
      var name = document.getElementById("name").value
        ? document.getElementById("name").value
        : "[NAME]";
      var neighborhood = document.getElementById("neighborhood").value
        ? document.getElementById("neighborhood").value
        : "[NEIGHBORHOOD]";

      var explainText = "";
      var otherEmails = "info38@council.nyc.gov,prosunsetpark@gmail.com";
      if (data.district_number === "38") {
        explainText = `<p>Your Council Member, Carlos Menchaca, has already committed to voting NO on the Industry City rezoning application. Because of that, it'll be most effective to redirect calls and emails to Speaker Corey Johnson.</p>`;
        otherEmails = allCouncilEmails;
      }

      const phoneText = `Dear Council Member ${data.council_member},

My name is ${name} and I am calling to ask you to commit to vote “NO” on Industry City’s rezoning application when it comes to the City Council for a vote.
          
More than 5,000 members of the Sunset Park community, Congresswoman Nydia Velazquez, Senator Zellnor Myrie, and Council Member Carlos Menchaca have voiced their opposition to the Industry City plan. We, the residents of Sunset Park demand that you respect our community’s wishes to reject the Industry City Application.
          
Can you publicly commit to vote “NO” on the Industry City rezoning application?`;

      document.getElementById("call").innerHTML = `
${explainText}
<h2>
1. Call Your Rep
</h2>
<h3>
Council Member ${data.council_member}
</h3>
<p>
Phone: <a href="tel:${data.phone}">${data.phone}</a>
</p>
<p class="preview">
${phoneText}
</p>
          `;

      const subject = "Protect Sunset Park — vote NO on rezoning Industry City";
      const emailText = `Dear Councilmember ${data.council_member}, 

My name is ${name} and I am a resident of ${neighborhood}. I am reaching out to you to ask you to commit to voting “NO” on Industry City’s rezoning application when it comes to the City Council for a vote. Right now, a small group of private landlords are trying to transform the largest working-class industrial waterfront into a destination for large luxury stores, corporate tenants, and hotels. 
          
We, the residents of Sunset Park, urge you to say NO to this private waterfront plan and that you instead support us in our work for a community-led process to plan the future of Brooklyn’s waterfront communities. You’ll be supporting the voices of more than 5,000 members of the Sunset Park community, Congresswoman Nydia Velazquez, State Senator Zellnor Myrie, and Council Member Carlos Menchaca who have voiced their opposition to the Industry City plan. 
          
Can you publicly commit to vote “NO” on the Industry City rezoning application?
          
You can see our full letter about our rejection of Industry City’s plan here: https://www.protectsunsetpark.org/endorsements
          
The fate and future of our waterfront is in your hands. Please act to protect Sunset Park and the working people of Brooklyn for 2030 and beyond.
          
In Unity,
${name}`;

      var url = `https://mail.google.com/mail/?view=cm&fs=1&to=${
        data.email
      }&su=${subject}&body=${encodeURIComponent(emailText)}&bcc=${otherEmails}`;
      document.getElementById("preview").innerHTML = `
<h2>
2. Email Your Rep
</h2>
<p class="preview">
${emailText}
</p>
<div class="send-mail-container">
<div class="send-mail">
<a href="${url}" target="_blank"><button class="button-highlight">
Send with Gmail
</button>
</a>
</div>
<div class="send-mail">
<a href="mailto:${
        data.email
      }?subject=${subject}&bcc=${otherEmails}&body=${encodeURIComponent(
        emailText
      )}"><button class="button-highlight">Send with Mail App</button></a>
<p style="margin:5px;"><i>(best for mobile)</i></p>
</div>
</div>
  `;
    });
  });
}

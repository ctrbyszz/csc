let CSC_DATA = [];

// LOAD JSON
fetch("./wynik.json", { cache: "no-store" })
  .then(r => {
    if (!r.ok) throw new Error("HTTP " + r.status);
    return r.json();
  })
  .then(data => {
    CSC_DATA = data.map(item => {
      const desc = item.description || "";
      const country = desc.split("(")[0].trim(); // extract country

      return {
        code: item.csc.toUpperCase(),
        country: country,
        info: desc
      };
    });

    console.log("CSC loaded:", CSC_DATA.length);
  })
  .catch(err => {
    console.error("FETCH ERROR:", err);
    alert("Error loading CSC data");
  });

// TABS
document.querySelectorAll(".tab").forEach(tab => {
  tab.onclick = () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.tab).classList.add("active");
  };
});

// AUTOCOMPLETE
function autocomplete(input, list, key, render) {
  input.addEventListener("input", () => {
    list.innerHTML = "";
    const val = input.value.toLowerCase();
    if (!val || CSC_DATA.length === 0) return;

    CSC_DATA.filter(c => c[key].toLowerCase().includes(val))
      .slice(0, 10)
      .forEach(c => {
        const li = document.createElement("li");
        li.textContent = key === "code" ? c.code : c.country;
        li.onclick = () => {
          input.value = li.textContent;
          list.innerHTML = "";
          render();
        };
        list.appendChild(li);
      });
  });
}

// CSC SEARCH
autocomplete(
  cscInput,
  cscSuggest,
  "code",
  () => {
    const c = CSC_DATA.find(x => x.code === cscInput.value.toUpperCase());
    cscResult.innerHTML = c ? `
      <div class="card">
        <b>CSC:</b> ${c.code}<br>
        <b>Country:</b> ${c.country}<br>
        <b>Description:</b> ${c.info}
      </div>` : "";
  }
);

// COUNTRY SEARCH
autocomplete(
  countryInput,
  countrySuggest,
  "country",
  () => {
    const val = countryInput.value.toLowerCase();
    countryResult.innerHTML = CSC_DATA
      .filter(c => c.country.toLowerCase().includes(val))
      .map(c => `
        <div class="card">
          <b>${c.code}</b><br>${c.info}
        </div>`).join("");
  }
);

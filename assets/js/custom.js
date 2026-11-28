
const forma = document.getElementById("kontaktu-forma");
const laukai = document.querySelectorAll("#kontaktu-forma .tikrinamas");
const siustiMygtukas = document.getElementById("siusti");
const isvalytiMygtukas = document.getElementById("isvalyti");
const telefonoLaukas = document.getElementById("telefonas");
const rezultatas = document.getElementById("rezultatas");
const vidurkisBlokas = document.getElementById("vidurkis");



function patikrintiLauka(laukas) {
  const reiksme = laukas.value.trim();
  const id = laukas.id;


  if (reiksme === "") {
    return "Šis laukas yra privalomas.";
  }


  if (id === "vardas" || id === "pavarde") {
    if (!/^\p{L}+$/u.test(reiksme)) {
      return "Leidžiamos tik raidės.";
    }
  }


  if (id === "pastas") {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reiksme)) {
      return "Neteisingas el. pašto formatas (pvz. vardas@mail.to).";
    }
  }


  if (id === "telefonas") {
    if (!/^\+370 6\d{2} \d{5}$/.test(reiksme)) {
      return "Numeris turi būti formato +370 6xx xxxxx.";
    }
  }


  if (id.startsWith("klausimas")) {
    const skaicius = Number(reiksme);
    if (!Number.isInteger(skaicius) || skaicius < 1 || skaicius > 10) {
      return "Įveskite sveiką skaičių nuo 1 iki 10.";
    }
  }

  return "";
}


function parodytiKlaida(laukas) {
  const klaida = patikrintiLauka(laukas);
  laukas.nextElementSibling.textContent = klaida;

  if (klaida === "") {
    laukas.classList.remove("neteisingas");
    laukas.classList.add("teisingas");
  } else {
    laukas.classList.add("neteisingas");
    laukas.classList.remove("teisingas");
  }
}


function atnaujintiMygtuka() {
  let yraKlaidu = false;
  for (const laukas of laukai) {
    if (patikrintiLauka(laukas) !== "") {
      yraKlaidu = true;
    }
  }
  siustiMygtukas.disabled = yraKlaidu;
}



function formatuotiTelefona(tekstas) {
  let skaitmenys = tekstas.replace(/\D/g, "");


  if (skaitmenys.startsWith("370")) {
    skaitmenys = skaitmenys.slice(3);
  }


  skaitmenys = skaitmenys.slice(0, 8);

  if (skaitmenys === "") {
    return "";
  }

  let rezultatas = "+370 " + skaitmenys.slice(0, 3);
  if (skaitmenys.length > 3) {
    rezultatas = rezultatas + " " + skaitmenys.slice(3);
  }
  return rezultatas;
}



for (const laukas of laukai) {
  laukas.addEventListener("input", function () {
    if (laukas.id === "telefonas") {
      laukas.value = formatuotiTelefona(laukas.value);
    }
    parodytiKlaida(laukas);
    atnaujintiMygtuka();
  });


  laukas.addEventListener("blur", function () {
    parodytiKlaida(laukas);
  });
}



forma.addEventListener("submit", function (ivykis) {
  // Sustabdome numatytąjį pateikimą (puslapis neperkraunamas)
  ivykis.preventDefault();


  for (const laukas of laukai) {
    parodytiKlaida(laukas);
  }
  atnaujintiMygtuka();
  if (siustiMygtukas.disabled) {
    return;
  }


  const duomenys = {
    vardas: document.getElementById("vardas").value.trim(),
    pavarde: document.getElementById("pavarde").value.trim(),
    elPastas: document.getElementById("pastas").value.trim(),
    telefonas: document.getElementById("telefonas").value.trim(),
    adresas: document.getElementById("adresas").value.trim(),
    klausimas1: Number(document.getElementById("klausimas1").value),
    klausimas2: Number(document.getElementById("klausimas2").value),
    klausimas3: Number(document.getElementById("klausimas3").value)
  };


  console.log(duomenys);


  rezultatas.textContent =
    "Vardas: " + duomenys.vardas + "\n" +
    "Pavardė: " + duomenys.pavarde + "\n" +
    "El. paštas: " + duomenys.elPastas + "\n" +
    "Tel. numeris: " + duomenys.telefonas + "\n" +
    "Adresas: " + duomenys.adresas + "\n" +
    "1 klausimas: " + duomenys.klausimas1 + "\n" +
    "2 klausimas: " + duomenys.klausimas2 + "\n" +
    "3 klausimas: " + duomenys.klausimas3;

 
  const vidurkis = (duomenys.klausimas1 + duomenys.klausimas2 + duomenys.klausimas3) / 3;
  vidurkisBlokas.textContent = duomenys.vardas + " " + duomenys.pavarde + ": " + vidurkis.toFixed(2);
});



isvalytiMygtukas.addEventListener("click", function () {
  forma.reset();
  rezultatas.textContent = "";
  vidurkisBlokas.textContent = "";

  for (const laukas of laukai) {
    laukas.classList.remove("neteisingas");
    laukas.classList.remove("teisingas");
    laukas.nextElementSibling.textContent = "";
  }

  atnaujintiMygtuka();
});

atnaujintiMygtuka();
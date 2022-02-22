AFRAME.registerComponent("atoms", {
  init: async function () {
    var compounds = await this.getCompounds();

    var barcodes = Object.keys(compounds);
    barcodes.map((barcode) => {
      var element = compounds[barcode];
      //console.log(element)
      this.createAtoms(element);
    });
  },

  getCompounds: async function () {
    return fetch("js/compoundList.json")
      .then((response) => response.json())
      .then((data) => data);
  },
  getCompoundsColor: function () {
    return fetch("js/elementColors.json")
      .then((response) => response.json())
      .then((data) => data);
  },

  createAtoms: async function (element) {
    //create element data
    var elementName = element.element_name;
    var barcodeValue = element.barcode_value;
    var numOfElectron = element.number_of_electron;

    // get the color of element
    var color = await this.getCompoundsColor();

    var scene = document.querySelector("a-scene");

    var marker = document.createElement("a-marker");
    marker.setAttribute("id", `marker-${barcodeValue}`);
    marker.setAttribute("type", "barcode");
    marker.setAttribute("element-name", elementName);
    marker.setAttribute("value", barcodeValue);
    scene.appendChild(marker);

    // add atom
    var atom = document.createElement("a-entity");
    // Na-13 ,Cl-5
    atom.setAttribute("id", `${elementName}-${barcodeValue}`);
    marker.appendChild(atom);

    // create atom card
    var card = document.createElement("a-entity"); // id card-Na card-Cl
    card.setAttribute("id", `card-${elementName}`);
    card.setAttribute("geometry", { primitive: "plane", width: 1, height: 1 });
    card.setAttribute("position", { x: 0, y: 0, z: 0 });
    card.setAttribute("rotation", { x: -90, y: 0, z: 0 });
    card.setAttribute("material", { src: `./assets/atom_cards/card_${elementName}.png` });
    atom.appendChild(card);

    //create Nucleus
    var nucleusRadius = 0.2;
    var nucleus = document.createElement("a-entity");
    // id nucleus-Na nucleus-Cl
    nucleus.setAttribute("id", `nuclues-${elementName}`);
    nucleus.setAttribute("geometry", {
      primitive: "sphere",
      radius: nucleusRadius,
    });
    nucleus.setAttribute("material", "color", color[elementName]);
    nucleus.setAttribute("position", { x: 0, y: 1, z: 0 });
    nucleus.setAttribute("rotation", { x: 0, y: 0, z: 0 });

    var nucleusName = document.createElement("a-entity");
    nucleusName.setAttribute("id", `nuclues-name${elementName}`);
    nucleusName.setAttribute("position", { x: 0.4, y: 0.21, z: -0.06 });
    nucleusName.setAttribute("rotation", { x: -90, y: 0, z: 0 });
    nucleusName.setAttribute("text", {
      //font: "monid",
      width: 3,
      color: "black",
      align: "center",
      value: elementName,
    });
    nucleus.appendChild(nucleusName);
    atom.appendChild(nucleus);
    console.log(atom);

    var orbitAngle = -180;
    var electroAngle = 30;

    for (var i = 1; i <= numOfElectron; i++) {
      var orbit = document.createElement("a-entity");
      orbit.setAttribute("geometry", {
        primitive: "torus",
        arc: 360,
        radius: 0.001,
        radiusTubular: 0.001,
      });
      orbit.setAttribute("material", {
        color: "#ff9e80",
        opacity: 0.3,
      });
      orbit.setAttribute("position", { x: 0, y: 1, z: 0 });
      orbit.setAttribute("rotation", { x: 0, y: orbitAngle, z: 0 });
      orbitAngle += 45;
      atom.appendChild(orbit);

      //create electron
      var electronGroup = document.createElement("a-entity");
      electronGroup.setAttribute("id", `electrongroup-${elementName}`);
      electronGroup.setAttribute("rotation", { x: 0, y: 0, z: electroAngle });
      electroAngle += 65;
      electronGroup.setAttribute("animation", {
        property: "rotation",
        to: `0 0-360`,
        loop: true,
        dur: 3500,
        easing: "linear",
      });

      orbit.appendChild(electroAngle);

      //electron
      var electron = document.createElement("a-entity");
      electron.setAttribute("id", `electron-${elementName}`);
      electron.setAttribute("material", {
        color: "#ff9e10",
        opacity: 0.3,
      });
      electron.setAttribute("position", { x: 0.2, y: 0.3, z: 0.3 });

      electron.setAttribute("geometry", {
        primitive: "sphere",
        radius: 0.02,
      });

      electronGroup.appendChild(electron);
    }
  },
});

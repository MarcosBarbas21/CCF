let data;
let lotes = [];
let allLotes = [];
let allUsers = [];
let allLotesFiltradosPorLote = [];
let lote = {
  name: null,
  coords: null,
  area: null,
  userId: null,
};
let lotesFiltrados = [];
let loteFiltrado = {
  name: null,
  coords: null,
  area: null,
  loteId: null,
};
let user = {
  name: null,
  password: null,
};

const mainMenu = async () => {
  document.getElementById('app').innerHTML = `
  <input type="text" placeholder="Ingrese su usuario" id="user"/>
  <input type="password" placeholder="Ingrese su contrasena" id="password"/>
  <input type="button" value="Ingresar" onclick="loginButton()"/>`;
  const response = await fetch('http://localhost:3000/api/users');
  allUsers = await response.json();
};

const menuMapas = async () => {
  document.getElementById('app').innerHTML = `
  <input type="button" value="Analizar nuevos lotes" onclick="menuAnalizarMapa()"/>
  <input type="button" value="Visualizar mapas ya analizados" onclick="menuMapasAnalizados()"/>`;
};

const menuAnalizarMapa = () => {
  document.getElementById('app').innerHTML = `
    <input value="asd" type="file" onChange="readFile(this)" />
    </br>
    <h3>Seleccione el lote</h3>
    <div>
      <select id="lotes" name="select" onClick="selectLoft()">
      </select>
    </div>
    <input value="Agregar nuevo lote:" type="button" onClick="addPolygon()"/>
    <div id="polygons">
    </div>
    </br>
    <div>
      <ul id="selectedLofts"></ul>
    </div>
    </br>
    <label for="machineWidth">
      Ancho de la maquina:<br>
    <input type="number" id="machineWidth"/>
    </label><br>
    <input value="Ver resultado" type="button" id="generateMapButton" onClick="analyze()"/>
    <div id="maps">
    </div>
    <div id="result">
    </div>
    <input type="button" value="Probar con otro" onclick="menuAnalizarMapa()"/>
    <input type="button" value="Volver" onclick="menuMapas()"/>`;
  showLofts();
};

const menuMapasAnalizados = () => {
  document.getElementById('app').innerHTML = `
  <h3>Seleccione los lotes analizados</h3>
  <div>
    <select id="lotesTodosFiltrados" name="select" onClick="selectLoftBeenFiltered()">
    </select>
  </div>
  <div id="FilteredComboBox">
    <select id="lotesFiltrados" name="selectFiltered" onClick="selectFilteredLoft()">
    </select>
  </div>
  <div>
    <ul id="selectedFilteredLofts"></ul>
  </div>
  <input value="Mostrar lotes" type="button" id="generateMapButtonFiltered" onClick="generateMapFiltered()"/>
  <div id="maps2"></div>
  <div id="result2">
  </div>
  <input type="button" value="Probar con otro" onclick="menuMapasAnalizados()"/>
  <input type="button" value="Volver" onclick="menuMapas()"/>`;
  showLoftsBeenFiltered();
};

const loginButton = () => {
  let usuario = document.getElementById('user').value;
  let pass = document.getElementById('password').value;
  let count = 0;
  for (let i = 0; i < allUsers.length; i++) {
    console.log(allUsers, usuario, pass);
    if (allUsers[i].name == usuario && pass == allUsers[i].password) {
      user.id = allUsers[i].id;
      console.log(allUsers[i].id);
      menuMapas();
    } else {
      count++;
    }
  }
  if (allUsers.length == count) alert('Usuario o contrasena no valido');
};

const showLofts = async () => {
  let field = document.getElementById('lotes');
  field.innerHTML = '';
  const response = await fetch('http://localhost:3000/api/lotes');
  const lofts = await response.json();
  if (allLotes) {
    for (let i = 0; i < allLotes.length; i++) {
      allLotes.pop();
    }
  }
  allLotes = [...lofts];
  for (let i = 0; i < lofts.length; i++) {
    if (lofts[i].userId == 1) {
      let option = `<option value="${lofts[i].name}">${lofts[i].name}</option>`;
      field.insertAdjacentHTML('beforeend', option);
    }
  }
  if (allLotes.length == 0) {
    let option = `<option>No hay lotes cargados</option>`;
    field.insertAdjacentHTML('beforeend', option);
  }
};

const selectFilteredLoft = () => {
  const selected = document.getElementById('lotesFiltrados').value;
  console.log(allLotesFiltradosPorLote.length);
  for (let i = 0; i < allLotesFiltradosPorLote.length; i++) {
    console.log(allLotesFiltradosPorLote[i].name, selected);
    if (allLotesFiltradosPorLote[i].name == selected) {
      lotesFiltrados.push(allLotesFiltradosPorLote[i]);
    }
  }
  console.log(lotesFiltrados);
  selectedFilteredLofts();
};

const selectedFilteredLofts = () => {
  const ul = document.getElementById('selectedFilteredLofts');
  ul.innerHTML = '';
  for (let i = 0; i < lotesFiltrados.length; i++) {
    console.log(lotesFiltrados);
    let li = `<li onclick="eraseLoteFiltrado(${i})">${lotesFiltrados[i].name}</li>`;
    ul.insertAdjacentHTML('beforeend', li);
  }
};

const generateMapFiltered = async () => {
  document.getElementById('generateMapButtonFiltered').style.visibility =
    'hidden';
  let coordenadas = [];
  //const response = await fetch('http://localhost:3000/api/filtrados');
  //const lofts = await response.json();
  for (let i = 0; i < lotesFiltrados.length; i++) {
    coordenadas.push(JSON.parse(allLotesFiltradosPorLote[i].coords));
    console.log(allLotesFiltradosPorLote, allLotes);
    for (let j = 0; j < allLotes.length; j++) {
      console.log(allLotesFiltradosPorLote[i].id, allLotes[j]);
      if (allLotesFiltradosPorLote[i].id == allLotes[j].id) {
        percentage(
          'result2',
          i,
          allLotesFiltradosPorLote[i].area,
          allLotes[j].area,
          lotesFiltrados
        );
      }
    }
  }
  console.log(coordenadas);
  generateMap('maps2', coordenadas, lotesFiltrados);
};

const showLoftsBeenFiltered = async () => {
  let field = document.getElementById('lotesTodosFiltrados');
  field.innerHTML = '';
  const response = await fetch('http://localhost:3000/api/lotes');
  const lofts = await response.json();
  if (allLotes) {
    for (let i = 0; i < allLotes.length; i++) {
      allLotes.pop();
    }
  } else {
    let option = `<option>No hay lotes disponibles</option>`;
    field.insertAdjacentHTML('beforeend', option);
  }
  allLotes = [...lofts];
  for (let i = 0; i < lofts.length; i++) {
    if (allLotes[i].userId == 1) {
      let option = `<option value="${allLotes[i].name}">${allLotes[i].name}</option>`;
      field.insertAdjacentHTML('beforeend', option);
    }
  }
  if (allLotes.length == 0) {
    let option = `<option>No hay lotes disponibles</option>`;
    field.insertAdjacentHTML('beforeend', option);
  }
};

const showFilteredLoftByLoft = async (index) => {
  let field = document.getElementById('lotesFiltrados');
  field.innerHTML = '';
  const response = await fetch('http://localhost:3000/api/filtrados');
  const loftsFiltrados = await response.json();
  if (allLotesFiltradosPorLote) {
    for (let i = 0; i < allLotesFiltradosPorLote.length; i++) {
      allLotesFiltradosPorLote.pop();
    }
  }
  allLotesFiltradosPorLote = [...loftsFiltrados];
  for (let i = 0; i < loftsFiltrados.length; i++) {
    console.log(loftsFiltrados[i].id, index);
    if (loftsFiltrados[i].id == index) {
      let option = `<option value="${loftsFiltrados[i].name}">${loftsFiltrados[i].name}</option>`;
      field.insertAdjacentHTML('beforeend', option);
      jindex = i;
    }
  }
  if (allLotesFiltradosPorLote.length == 0) {
    let option = `<option>No hay lotes disponibles</option>`;
    field.insertAdjacentHTML('beforeend', option);
  }
};

const selectLoftBeenFiltered = () => {
  const selected = document.getElementById('lotesTodosFiltrados').value;
  let index;
  for (let i = 0; i < allLotes.length; i++) {
    console.log(allLotes[i].name, selected, index);
    if (allLotes[i].name == selected) {
      index = i + 1;
    }
  }
  showFilteredLoftByLoft(index);
};

const selectLoft = () => {
  const selected = document.getElementById('lotes').value;
  for (let i = 0; i < allLotes.length; i++) {
    if (allLotes[i].name == selected) {
      lotes.push(allLotes[i]);
    }
  }
  selectedLofts();
};

const eraseLoteFiltrado = (index) => {
  lotesFiltrados.splice(index, 1);
  selectedFilteredLofts();
};

const eraseLote = (index) => {
  lotes.splice(index, 1);
  selectedLofts();
};

const selectedLofts = () => {
  const ul = document.getElementById('selectedLofts');
  ul.innerHTML = '';
  for (let i = 0; i < lotes.length; i++) {
    let li = `<li onclick="eraseLote(${i})">${lotes[i].name}</li>`;
    ul.insertAdjacentHTML('beforeend', li);
  }
};

const analyze = () => {
  try {
    document.getElementById('generateMapButton').style.visibility = 'hidden'; //ESCONDE EL BOTON 'VER RESULTADO DESPUES DE EJECUTAR'
    let coordinates = getCoordinates(data); //OBTIENE LAS COORDENADAS
    let filteredMap = getValidatedCoordinates(data, coordinates); //VALIDA LAS UTILES
    generateMap('maps', filteredMap, lotes); //GENERA EL MAPA
    areaCalculator(filteredMap); //CALCULA LAS AREAS
  } catch {
    alert('Error'); //CASO DE FALLO ALERTA Y ACTUALIZA PAGINA
    //location.reload();
  }
};
const addPolygon = () => {
  ///FUNCION BOTON 'AGREGAR LOTE'
  const getElementDiv = document.getElementById('polygons');
  let inputNumber = getElementDiv.childElementCount; //CUENTA LOS HIJOS ACTUALES (ES CON -1 PORQUE EL BOTON CUENTA YA COMO UN HIJO)
  getElementDiv.innerHTML = '';
  if (inputNumber < 2) {
    let loftCoords = `<input placeholder="Pegar coodenadas" type="text" id="loftCoords"/>`;
    let loftName = `<input placeholder="Nombre de Lote" type="text" id="loftName"/>`;
    let confirmButton = `<input value="Confirmar" type="button" onClick=confirmLote() id="confirmLote"/>`;
    getElementDiv.insertAdjacentHTML('beforeend', loftName);
    getElementDiv.insertAdjacentHTML('beforeend', loftCoords);
    getElementDiv.insertAdjacentHTML('beforeend', confirmButton);
  }
};

const confirmLote = async () => {
  const loftCoords = document.getElementById('loftCoords');
  const loftName = document.getElementById('loftName');
  const loftArea = loftAreaCalculator(loftCoords.value);
  lote.userId = user.id;
  lote.coords = loftCoords.value;
  lote.name = loftName.value;
  lote.area = loftArea;
  const postLote = async () => {
    fetch('http://localhost:3000/api/lotes', {
      method: 'POST',
      body: JSON.stringify(lote),
      headers: { 'Content-type': 'application/json;charset=UTF-8' },
    })
      .then((response) => response.json())
      .then((json) => console.log(json))
      .catch((err) => console.log(err));
    document.getElementById('polygons').innerHTML = '<h2>Agregado</h2>';
  };
  await postLote();
  await showLofts();
};

const readFile = (input) => {
  //FUNCION QUE LEE EL ARCHIVO
  let file = input.files[0];
  let fileReader = new FileReader();
  fileReader.readAsText(file);
  fileReader.onload = function () {
    data = fileReader.result; //LA ALMACENA EN 'DATA' QUE ES UNA VARIABLE GLOBAL
  };
  fileReader.onerror = function () {
    alert(fileReader.error);
  };
};

const getCoordinates = (props) => {
  //TOMA EL JSON (ARCHIVO) Y EXTRAE LAS COORDENADAS
  const newData = JSON.parse(props);
  const featuresLength = newData['features'].length;
  let coordinates =
    newData['features'][featuresLength - 1]['geometry']['coordinates'];
  for (let i = 0; i < coordinates.length; i++) {
    coordinates[i].pop([2]);
    coordinates[i] = coordinates[i].reverse(); //INVIERTE EL ORDEN DE LAS COORDENADAS
  }
  return coordinates;
};

const getValidatedCoordinates = (props, coordinates) => {
  //TOMA LAS COORDENAS, LAS FILTRA CON LAS DESCRIPCIONES LIMPIAS Y VALIDA CUANDO ESTUVO EN MOVIMIENTO
  const newData = JSON.parse(props);
  const regex = /(<b>).+?(<br>)/g;
  const regex2 = /(<\/b>).+?(<br>)/g;
  const regex3 = /(<b>).+?(<\/b>)/g;
  const featuresLength = newData['features'].length;
  let descriptionArray = [[], [], []];
  for (let i = 0; i < featuresLength; i++) {
    let description = newData['features'][i]['properties']['description'];
    getDescriptionArray(regex3, description, descriptionArray[0]);
    getDescriptionArray(regex2, description, descriptionArray[1]);
    while ((match = regex2.exec(description)) !== null) {
      regex.lastIndex -= 2;
      descriptionArray[2].push(i);
    }
  }
  let validatedCoords = sliceDescription(descriptionArray, coordinates);
  let filteredMap = filterMap(validatedCoords, lotes);
  loteFiltrado.coords = JSON.stringify(filteredMap);
  return filteredMap;
};

const sliceDescription = (descriptionArray, coordinates) => {
  //TOMA UN ARREGLO CON LAS DESCRIPCIONES DEL MAPA Y LAS COORDENADAS, DEVUELVE LAS COORDENADAS LIMPIAS
  const indexKey1 = '<b>';
  const indexKey2 = '</b>';
  const indexKey3 = '<br>';
  descriptionSlicer(descriptionArray[0], indexKey1, indexKey2);
  descriptionSlicer(descriptionArray[1], indexKey2, indexKey3);
  const indexes = new Set(descriptionArray[2]);
  let descriptionIndexes = [...indexes];
  let allDescriptions = unifyDescription(descriptionArray, descriptionIndexes);
  let validatedCoords = descriptionValidator(
    coordinates,
    allDescriptions,
    ' En movimiento'
  );
  return validatedCoords;
};

const descriptionSlicer = (toSliceArray, firstKey, lastKey) => {
  //SE ENCARGA DE LIMPIAR LAS DESCRIPCIONES
  for (let i = 0; i < toSliceArray.length; i++) {
    let from = toSliceArray[i].indexOf(firstKey) + firstKey.length;
    let to = toSliceArray[i].indexOf(lastKey);
    toSliceArray[i] = toSliceArray[i].slice(from, to);
  }
};

const getDescriptionArray = (regex, toSlice, saveInto) => {
  //CON LAS EXPRESIONES REGULARES SEPARA EL STRING DEL JSON EN PARTES
  while ((match = regex.exec(toSlice)) !== null) {
    saveInto.push(match[0]);
    regex.lastIndex -= 2;
  }
};

const unifyDescription = (descriptionArray, descriptionIndexes) => {
  //UNIFICA LAS DESCRIPCIONES SUELTAS EN ARREGLOS
  let unifiedDescriptions = [];
  for (let i = 0; i < descriptionIndexes.length; i++) {
    let count = 0;
    let partialDescriptions = [[], [], [], [], []];
    for (let j = 0; j < descriptionArray[0].length; j++) {
      if (descriptionArray[2][j] == descriptionIndexes[i]) {
        partialDescriptions[count].push(descriptionArray[0][j]);
        partialDescriptions[count].push(descriptionArray[1][j]);
        count++;
      }
    }
    unifiedDescriptions.push(partialDescriptions);
  }
  return unifiedDescriptions;
};

const descriptionValidator = (coords, descriptionArray, toCompare) => {
  //COMPARA PA DESCRIPCION POR LO QUE SE LA PASA COMO PARAMETRO
  let validatedCoords = [];
  for (let i = 0; i < descriptionArray.length; i++) {
    if (descriptionArray[i][1][1] == toCompare) validatedCoords.push(coords[i]);
  }
  return validatedCoords;
};

const filterMap = (data, lofts) => {
  //TOMA LAS COORDENADAS Y MIRA EL LOTE QUE SE DEBE FILTRAR
  let loftInnerCoords = [];
  for (let k = 0; k < lotes.length; k++) {
    let loft = getOneLoft(lofts[k].coords);
    let minPointX = miniumPointX(loft);
    let loftLinearEquationComponents = linearEquationComponents(loft);
    loftInnerCoords.push(
      getCoincidentMap(
        data,
        loft,
        loftLinearEquationComponents[0],
        loftLinearEquationComponents[1],
        loftLinearEquationComponents[2],
        minPointX
      )
    );
  }
  return loftInnerCoords;
};

const getCoincidentMap = (
  //TOMA LAS COORDENADAS, EL LOTE, LAS VARIABLES DE LA ECUACION LINEAL Y EL PUNTO MINIMO Y DEVULVE LOS PUNTOS QUE ESTAN DENTRO
  coords,
  polygon,
  aVariables,
  bVariables,
  cVariables,
  miniumPointX
) => {
  let coincidentMap = [];
  for (let i = 0; i < coords.length; i++) {
    let count = 0;
    let d1 = 0;
    let d2 = 0;
    for (let j = 0; j < aVariables.length; j++) {
      let flag = getFlagCondition(
        polygon[j][0],
        polygon[j + 1][0],
        coords[i][0]
      );
      if (flag) {
        d1 = linearEquationReplace(
          aVariables[j],
          bVariables[j],
          cVariables[j],
          coords[i][0],
          miniumPointX - 1 / 10000
        );
        d2 = linearEquationReplace(
          aVariables[j],
          bVariables[j],
          cVariables[j],
          coords[i][0],
          coords[i][1]
        );
        if (!((d1 < 0 && d2 < 0) || (d1 > 0 && d2 > 0))) count++;
      }
    }
    if (count % 2 != 0 && count != 0) coincidentMap.push(coords[i]);
  }
  return coincidentMap;
};

const miniumPointX = (coords) => {
  //CALCULA EL PUNTO MINIMO
  let minPointX = coords[0][1];
  for (let i = 0; i < coords.length; i++) {
    if (coords[i][1] < minPointX) {
      minPointX = coords[i][1];
    }
  }
  return minPointX;
};

const getFlagCondition = (actualCoordX, nextCoordX, toCompareCoord) => {
  //REVISA SI UN PUNTO ESTA ENTRE EL ACTUAL Y EL PROXIMO
  let flag = false;
  if (actualCoordX > nextCoordX) {
    if (actualCoordX >= toCompareCoord && nextCoordX <= toCompareCoord) {
      flag = true;
    }
  } else {
    if (actualCoordX <= toCompareCoord && nextCoordX >= toCompareCoord) {
      flag = true;
    }
  }
  return flag;
};

const linearEquationComponents = (coords) => {
  //TOMA LAS COORDENADAS Y DEVUELVE LAS VARIABLES DE LAS ECUACION LINEALES
  let aVariable = [];
  let bVariable = [];
  let cVariable = [];
  for (let i = 0; i < coords.length - 1; i++) {
    aVariable.push(-(coords[i + 1][1] - coords[i][1]));
    bVariable.push(coords[i + 1][0] - coords[i][0]);
    cVariable.push(
      -(coords[i + 1][0] * coords[i][1] - coords[i][0] * coords[i + 1][1])
    );
  }
  return [aVariable, bVariable, cVariable];
};

const linearEquationReplace = (
  //SE REMPLAZAN PUNTOS EN LAS ECUACIONES LINEAS PARA SABER SI HUBO INTERSECCION
  aVariable,
  bVariable,
  cVariable,
  xVariable,
  yVariable
) => {
  const result = bVariable * yVariable + aVariable * xVariable + cVariable;
  return result;
};

const loftAreaCalculator = (coords) => {
  //CALCULA LAS AREAS POR EL ARREGLO DE COORDENADAS
  const latitude = 111132.954 / 1000;
  let loft = getOneLoft(coords);
  let average = averageCoords(loft);
  let vectorsA = vectorsWithInitialPoint(loft, average, 0);
  let vectorsB = vectorsWithInitialPoint(loft, average, 1);
  let vectorModulesA = modules(vectorsA, latitude);
  let vectorModulesB = modules(vectorsB, latitude);
  let semiPerimeters = semiPerimeter(vectorModulesA, vectorModulesB);
  let partialTriangles = partialTriangle(
    semiPerimeters,
    vectorModulesA,
    vectorModulesB
  );
  let polyArea = polygonArea(partialTriangles);
  return polyArea;
};

const areaCalculator = async (data) => {
  //CALCULA LAS AREAS, POR MEDIO DE DATA EL AREA CUBIERTA POR LA COSECHADORA, Y POR ARRAY EL AREA DEL LOTE
  const latitude = 111132.954 / 1000;
  const machineWidth = document.getElementById('machineWidth').value;
  for (let i = 0; i < lotes.length; i++) {
    /*(async () => {
      fetch('http://localhost:3000/api/filtrados', {
        method: 'POST',
        body: JSON.stringify(loteFiltrado),
        //mode: 'no-coors',
        headers: { 'Content-type': 'application/json;charset=UTF-8' },
      })
        .then((response) => response.json())
        .then((json) => console.log(json))
        .catch((err) => console.log(err));
    })();
    (async () => {
      fetch('http://localhost:3000/api/filtrados', {
        method: 'GET',
        //mode: 'no-coors',
        //headers: { 'Content-type': 'application/json;charset=UTF-8' },
      })
        .then((response) => response.json())
        .then((json) => console.log(json))
        .catch((err) => console.log(err));
    })();*/
    let polyArea = lotes[i].area;
    let totalDistance = machineCoveredArea(data[i], latitude);
    let totalArea = (totalDistance * machineWidth) / 1000;
    let date = new Date(Date.now());
    let fecha =
      date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear();
    loteFiltrado.area = totalArea;
    loteFiltrado.name = 'Lote ' + lotes[i].name + ' con Fecha ' + fecha;
    console.log(loteFiltrado.name);
    loteFiltrado.loteId = lotes[i].id;
    loteFiltrado.coords = JSON.stringify(data[i]);
    /*(async () => {
      fetch('http://localhost:3000/api/filtrados', {
        method: 'POST',
        body: JSON.stringify(loteFiltrado),
        //mode: 'no-coors',
        headers: { 'Content-type': 'application/json;charset=UTF-8' },
      })
        .then((response) => response.json())
        .then((json) => console.log(json))
        .catch((err) => console.log(err));
    })();*/
    const postFiltrado = async () => {
      fetch('http://localhost:3000/api/filtrados', {
        method: 'POST',
        body: JSON.stringify(loteFiltrado),
        headers: { 'Content-type': 'application/json;charset=UTF-8' },
      })
        .then((response) => response.json())
        .then((json) => console.log(json))
        .catch((err) => console.log(err));
    };
    await postFiltrado();
    percentage('result', i, totalArea, polyArea, lotes);
  }
};

const getOneLoft = (coords) => {
  //TOMA DE LOS INPUT DEL HTML Y DEVUELVE UN ARREGLO DE LAS MISMAS
  let loft = JSON.parse(' [' + coords + ']');
  for (let i = 0; i < loft.length; i++) {
    loft[i] = loft[i].reverse();
  }
  return loft;
};

const getLoft = (array, index) => {
  //TOMA DE LOS INPUT LOS ARREGLOS DE COORDENADAS DE LOTES Y DEVUELVE LOS LOTES EN ARREGLO
  let polygon = lotes[index].coords;
  let loft = JSON.parse(' [' + polygon.value + ']');
  for (let i = 0; i < loft.length; i++) {
    loft[i] = loft[i].reverse();
  }
  return loft;
};

const vectorsWithAveragePoint = (coords, firstIndex) => {
  //CREA VECTORES DEL CENTRO(COORDENADA PROMEDIO) A TODOS LOS EXTREMOS
  let averageCoords = averageCoords(coords);
  let vectors = [[], []];
  for (let i = firstIndex; i < coords.length; i++) {
    vectors[0].push(averageCoords[0] - coords[i][0]);
    vectors[1].push(averageCoords[1] - coords[i][1]);
  }
  return vectors;
};

const vectorsWithSelfInitialPoint = (coords, firstIndex) => {
  //CREA VECTORES DEL PRIMER PUNTO A TODOS LOS EXTREMOS
  let vectors = [[], []];
  for (let i = firstIndex; i < coords.length; i++) {
    vectors[0].push(coords[0][0] - coords[i][0]);
    vectors[1].push(coords[0][1] - coords[i][1]);
  }
  return vectors;
};

const vectorsWithInitialPoint = (coords, initialPoint, firstIndex) => {
  //CREA VECTORES DEL PUNTO PASADO POR PARAMETRO A TODOS LOS EXTREMOS
  let vectors = [[], []];
  for (let i = firstIndex; i < coords.length; i++) {
    vectors[0].push(initialPoint[0] - coords[i][0]);
    vectors[1].push(initialPoint[1] - coords[i][1]);
  }
  return vectors;
};

const modules = (vectors, latitude) => {
  //CALCULA LOS MODULOS POR MEDIO DE LOS VECTORES, TAMBIEN TE PASA LO QUE VALE LA UNIDAD DE LATITUD
  let vectorModules = [];
  for (let i = 0; i < vectors[0].length; i++) {
    vectorModules.push(
      Math.sqrt(vectors[0][i] ** 2 + vectors[1][i] ** 2) * latitude
    );
  }
  return vectorModules;
};

const semiPerimeter = (vectorModulesA, vectorModulesB) => {
  //CREA LOS SEMIPERIMETROS POR MEDIO DE LOS MODULOS DE LOS VECTORES
  let semiPerimeters = [];
  for (let i = 0; i < vectorModulesB.length; i++) {
    semiPerimeters.push(
      (vectorModulesA[i] + vectorModulesA[i + 1] + vectorModulesB[i]) / 2
    );
  }
  return semiPerimeters;
};

const partialTriangle = (semiPerimeters, vectorModulesA, vectorModulesB) => {
  //CALCULA A TRAVES DE LOS MODULOS Y LOS VECTORES, EL AREA DE UN TRIANGULO
  let partialTriangles = [];
  for (let i = 0; i < semiPerimeters.length; i++) {
    let a = semiPerimeters[i] - vectorModulesA[i];
    let b = semiPerimeters[i] - vectorModulesA[i + 1];
    let c = semiPerimeters[i] - vectorModulesB[i];
    let partialTriangle = Math.sqrt(semiPerimeters[i] * a * b * c);
    if (partialTriangle) partialTriangles.push(partialTriangle);
  }
  return partialTriangles;
};

const polygonArea = (partialTriangles) => {
  //CALCULA A TRAVES DE LOS TRIANGULOS, EL AREA FINAL DE LOTE
  let polygonArea = 0;
  for (let i = 0; i < partialTriangles.length; i++) {
    polygonArea += partialTriangles[i];
  }
  return polygonArea;
};

const percentage = (where, index, totalArea, polygonArea, resultArray) => {
  //CALCULA EL PORCENTAJE POR CADA LOTE
  let percentage = (totalArea / polygonArea) * 100;
  if (percentage > 100) percentage = 100;
  percentage = Math.round(percentage, 2) + ' %';
  const result = document.getElementById(where);
  result.insertAdjacentHTML(
    'beforeend',
    `<h2>Resultado del lote ${resultArray[index].name}: "${percentage}"</h2>`
  );
};

const machineCoveredArea = (data, latitude) => {
  //CALUCLA LO QUE CUBRIO LA COSECHADORA DE LOTE
  let inBetweenDifferenceLatitude = [];
  let inBetweenDifferenceLongitude = [];
  for (let i = 0; i < data.length - 1; i++) {
    inBetweenDifferenceLatitude.push(data[i][0] - data[i + 1][0]);
    inBetweenDifferenceLongitude.push(data[i][1] - data[i + 1][1]);
    if (inBetweenDifferenceLatitude[i] < 0)
      inBetweenDifferenceLatitude[i] = -inBetweenDifferenceLatitude[i];
    if (inBetweenDifferenceLongitude[i] < 0)
      inBetweenDifferenceLongitude[i] = -inBetweenDifferenceLongitude[i];
  }
  let latitudeDistance = inBetweenDifferenceLatitude.reduce(reducer);
  let longitudeDistance = inBetweenDifferenceLongitude.reduce(reducer);
  let totalDistance = (longitudeDistance + latitudeDistance) * latitude;
  return totalDistance;
};

const reducer = (p, c) => p + c; //FUNCION QUE CALUCULA EL ACUMULADO DE UN ARREGLO

const generateMap = (where, coords, resultArray) => {
  //GENERA EL MAPA EN HTML
  let newMap = document.getElementById(where);
  //newMap.innerHTML = '';
  newMap.style.width = '100vw';
  newMap.style.height = '50vw';
  newMap.style.borderRadius = '20px';
  newMap.style.position = 'relative';
  console.log(coords);
  var map = L.map(where).setView(coords[0][0], 15);
  console.log(coords[0][0]);
  mapContainer(map, coords, resultArray);
};

const mapContainer = (map, coords, resultArray) => {
  //MODIFICA LO QUE ESTA CONTENIDO DENTRO DEL MAPA
  for (let i = 0; i < coords.length; i++) {
    let color = [
      'aqua',
      'brown',
      'chocolate',
      'darkmagenta',
      'yellow',
      'springgreen',
      'blue',
    ];
    var tiles = L.tileLayer(
      'https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',
      {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      }
    ).addTo(map);

    var polygon = L.polygon(coords[i], {
      color: `${color[i]}`,
    }).addTo(map);

    var popup = L.popup()
      .setLatLng(averageCoords(coords[i]))
      .setContent(`${resultArray[i].name}`)
      .addTo(map);
  }
};

const averageCoords = (coords) => {
  //CALCULA EL PROMEDIO DE LAS COORDENADAS
  let averageLatitude = 0;
  let averageLongitude = 0;
  for (let i = 0; i < coords.length; i++) {
    averageLatitude += coords[i][0];
    averageLongitude += coords[i][1];
  }
  averageLatitude /= coords.length;
  averageLongitude /= coords.length;

  return [averageLatitude, averageLongitude];
};

const app = async () => {
  mainMenu();
  //await menuMapas();
};

app();

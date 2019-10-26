// for all teh dog fucntions, just copied cat functions and
// added the dog params

const models = require('../models');

const Cat = models.Cat.CatModel;
const Dog = models.Dog.DogModel;

const defaultCatData = {
  name: 'unknown',
  bedsOwned: 0,
};
const defaultDogData = {
  name: 'unknown',
  breed: 'unknown',
  age: 0,
};

let lastAddedCat = new Cat(defaultCatData);
let lastAddedDog = new Dog(defaultDogData);

const hostIndex = (req, res) => {

  res.render('index', {
    currentName: lastAddedDog.name,
    title: 'Home',
    pageName: 'Home Page',
  });
};

const readAllCats = (req, res, callback) => {
  Cat.find(callback);
};

const readAllDogs = (req, res, callback) => {
  Dog.find(callback);
};

const readCat = (req, res) => {
  const name1 = req.query.name;

  const callback = (err, doc) => {
    if (err) {
      return res.json({ err }); // if error, return it
    }

    // return success
    return res.json(doc);
  };

  Cat.findByName(name1, callback);
};

const readDog = (req, res) => {
  const name2 = req.query.name;
  const callback = (err, doc) => {
    if (err) {
      return res.json({ err }); // if error, return it
    }

    // return success
    return res.json(doc);
  };

  Dog.findByName(name2, callback);
};

const hostPage1 = (req, res) => {
  const callback = (err, docs) => {
    if (err) {
      return res.json({ err }); // if error, return it
    }

    return res.render('page1', { cats: docs });
  };

  readAllCats(req, res, callback);
};

const hostPage2 = (req, res) => {
  res.render('page2');
};

const hostPage3 = (req, res) => {
  res.render('page3');
};

const hostPage4 = (req, res) => {
  const callback = (err, docs) => {
    if (err) {
      return res.json({ err }); // if error, return it
    }

    // return success
    return res.render('page4', { dogs: docs });
  };

  readAllDogs(req, res, callback);
};

const getCatName = (req, res) => {
  res.json({ name: lastAddedCat.name });
};

const getDogName = (req, res) => {
  res.json({ name: lastAddedDog.name });
};

const setCatName = (req, res) => {
  if (!req.body.firstname || !req.body.lastname || !req.body.beds) {
    return res.status(400).json({ error: 'firstname,lastname and beds are all required' });
  }

  const name = `${req.body.firstname} ${req.body.lastname}`;

  const catData = {
    name,
    bedsOwned: req.body.beds,
  };

  const newCat = new Cat(catData);

  const savePromise = newCat.save();

  savePromise.then(() => {
    lastAddedCat = newCat;
    res.json({ name: lastAddedCat.name, beds: lastAddedCat.bedsOwned });
  });

  savePromise.catch((err) => res.json({ err }));

  return res;
};

//pretty much same as cat name, but with dog params
const setDogName = (req, res) => {
  if (!req.body.firstname || !req.body.breed || !req.body.age) {
    return res.status(400).json({ error: 'firstname,breed and age are all required' });
  }

  const name = `${req.body.firstname}`;

  const dogData = {
    name,
    breed: req.body.breed,
    age: req.body.age,
  };

  const newDog = new Dog(dogData);

  const savePromise = newDog.save();

  savePromise.then(() => {
    lastAddedDog = newDog;
    res.json({ name: lastAddedDog.name, breed: lastAddedDog.breed, age: lastAddedDog.age });
  });

  // if error, return it
  savePromise.catch((err) => res.json({ err }));

  return res;
};

const searchCatName = (req, res) => {
  if (!req.query.name) {
    return res.json({ error: 'Name is required to perform a search' });
  }

  return Cat.findByName(req.query.name, (err, doc) => {
    if (err) {
      return res.json({ err }); // if error, return it
    }

    if (!doc) {
      return res.json({ error: 'No cats found' });
    }

    return res.json({ name: doc.name, beds: doc.bedsOwned });
  });
};

const searchDogName = (req, res) => {
  if (!req.query.name) {
    return res.json({ error: 'Name is required to perform a search' });
  }

  return Dog.findByName(req.query.name, (err, doc) => {
    // errs, handle them
    if (err) {
      return res.json({ err }); // if error, return it
    }

    if (!doc) {
      return res.json({ error: 'No dogs found' });
    }

    return res.json({ name: doc.name, breed: doc.breed, age: doc.age });
  });
};

const updateLastCat = (req, res) => {

  lastAddedCat.bedsOwned++;

  const savePromise = lastAddedCat.save();

  savePromise.then(() => res.json({ name: lastAddedCat.name, beds: lastAddedCat.bedsOwned }));

  savePromise.catch((err) => res.json({ err }));
};


const updateLastDog = (req, res) => {
  lastAddedDog.age++;


  const savePromise = lastAddedDog.save();

  savePromise.then(() => res.json({
    name: lastAddedDog.name,
    breed: lastAddedDog.breed,
    age: lastAddedDog.age,
  }));

  savePromise.catch((err) => res.json({ err }));
};


const notFound = (req, res) => {
  res.status(404).render('notFound', {
    page: req.url,
  });
};

// export the relevant public controller functions
module.exports = {
  index: hostIndex,
  page1: hostPage1,
  page2: hostPage2,
  page3: hostPage3,
  page4: hostPage4,
  readCat,
  readDog,
  getCatName,
  getDogName,
  setCatName,
  setDogName,
  updateLastCat,
  updateLastDog,
  searchCatName,
  searchDogName,
  notFound,
};

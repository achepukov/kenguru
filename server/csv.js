const csv = require( 'csv' );
const fs = require( 'fs-extra' );
const bodyParser = require('body-parser');
var iconvlite = require('iconv-lite');

let path = '', encoding='windows-1251';

const csvPromise = () => (new Promise( (resolve, reject) => {
    fs.readFile( path + 'main.csv', null, (err, rawData) => {
        if (err) {
            reject(err);
            return;
        }
        var data = iconvlite.decode(rawData, encoding);
        var commaCount = (data.match(/,/g) || {}).length || 0;
        var semicolonCount = (data.match(/;/g) || {}).length || 0;
        var delimiter = commaCount > semicolonCount ? ',' : ';';

         console.log(
           'commas %s semicolon: %s - delim: %s'
           .replace('%s', commaCount )
           .replace('%s', semicolonCount )
           .replace('%s', delimiter )
         );
        csv.parse(
          data,
          { delimiter: delimiter },
          (err, dataCsv) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(dataCsv);
        });
    });
}));

exports.webpackSetup = (app) => {
    app.use(bodyParser.json());
    /**
     * handle csv
     */
    app.post('/data', (req, res) => {
        path = (req.body.path || '').trim();
        encoding = req.body.encoding;
        console.log(encoding)
        if (!['/', '\\'].includes(path.slice(-1))) {
          path += '\\';
        }
        console.log(`Got path: ${path}`);
        csvPromise().then( csvData => {
            res.json( csvData )
        })
        .catch ( err => {
            res.status(404).send(`${err}`);
        });
    });

    /**
     * handle images
     */
    app.get('/images/:image', (req, res) => {
        const fullPath = path + req.params.image;
        if (fs.existsSync( fullPath )) {
            res.sendFile(
              fullPath,
              {maxAge: 0, lastModified: 11111 }
            );
        } else {
            res.status(404).send( `File not found in path ${fullPath}`);
        }
    })
};

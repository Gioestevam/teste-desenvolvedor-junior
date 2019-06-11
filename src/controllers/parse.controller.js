const fs        = require('fs'),
      filePath  = `${process.env.pathRoot}/public/json/characters.json`,
      fetch     = require('node-fetch');

/**
 * Shared
 */

const { compareBy } = require('../shared/orderObject');

class ParseController {
    constructor() { }

    generationCharacters(req, res) {
        fs.readFile(filePath, (err, data) => {
            if (err) {
                return res.end(err);
            }
            const json = JSON.parse(data.toString());
            
            //Devem ser listados somentes os personagens vivos
            let characters = json.filter(element => {
                return element.status === 'Alive';
            });

            characters = characters.map(async element => {
                let charactersAltered = element;
                charactersAltered['apparitionTotal'] = element.episode.length;
                charactersAltered['gender']          = (element.gender === 'Male' ? 'Masculino' : 'Feminino');
                charactersAltered['status']          = 'Vivo'
                charactersAltered['seasons']         = element.episode.map(async episode => {
                    let response = await fetch(episode);
                    return response.json();
                });
                charactersAltered['seasons'] = await Promise.all(charactersAltered['seasons']);
                return await charactersAltered; 
            });

            (async () => {
                characters = await Promise.all(characters);
                //Ordenar por: (decrescente) quantidade de aparições, nome (crescente)
                characters = characters.sort(compareBy('-apparitionTotal', 'name'));
                characters = characters.map(element => {
                    let charactersAltered = element;
                    let seasonGroupAmount = [];
                    //Existem 3 temporadas com 31 episódios ao todo, 
                    //sendo a primeira temporada com 11 episódios e as restantes com 10 episódios cada
                    element.seasons.forEach(element => {
                        if (seasonGroupAmount.length === 0) {
                            seasonGroupAmount.push({
                                season: element.episode.substring(1, 3),
                                amount: 1
                            });
                        } else {
                            let equalSession = false;
                            seasonGroupAmount.forEach(seasons => { 
                                if (seasons.season === element.episode.substring(1, 3)) {   
                                    equalSession = true;
                                    seasons.amount = seasons.amount + 1;
                                }
                            })
                            if (!equalSession) {
                                seasonGroupAmount.push({
                                    season: element.episode.substring(1, 3),
                                    amount: 1
                                });
                            }
                        }
                    });
                    charactersAltered['seasons'] = seasonGroupAmount;
                    return charactersAltered;
                })
                res.render('pages/home', {'characters': characters});
            })();
        })
    }
}

module.exports = ParseController;

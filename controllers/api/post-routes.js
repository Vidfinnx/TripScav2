const router = require('express').Router();
const { Site, User, Location } = require('../../models');
const sequelize = require('../../config/connection');
const withAuth = require('../../utils/auth');

router.get('/Site', withAuth, (req, res) => {
    Site.findAll({
        where: {
            user_id: req.session.user_id
        },
        attributes: ['id',
            'site_name',
            `city_name`,
            `rating`,
            `picture`,
            'description',
            'created_at'
        ],
        order: [
            ['created_at', 'DESC']
        ],
        include: [{
            model: User,
            attributes: ['username']
        },

        ]
    })
        .then(dbPostData => {

            const sites = dbPostData.map(post => post.get({ plain: true }));
            res.render('dashboard', { username: req.session.username, sites, loggedIn: true });

        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});


router.post('/save', withAuth, (req, res) => {
    console.log("++++++++++++YOUR HITTING THE SAVE ROUTE+++++++++");
    Site.create({
        user_id: req.session.user_id,
        city_name: req.body.city,
        site_name: req.body.site,
        rating: req.body.rating,
        picture: req.body.picture,
        description: req.body.description


    })
        .then(dbPostData => res.json(dbPostData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});


router.delete('/remove', withAuth, (req, res) => {
    console.log("+++++++++YOUR HITTING THE REMOVE ROUTE+++++++++++");
    Site.destroy({
        where: {
            user_id: req.session.user_id,
            site_name: req.body.site
        }
    }).then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({ message: 'No Site found with this id' });
            return;
        }
        res.json(dbPostData);
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;
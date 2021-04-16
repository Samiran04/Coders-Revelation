const User = require('../models/user');
const CodeForces = require('../models/codeforces');
const Rank = require('../models/rank');

const calculator = require('../rankCalculator/rankCalculator');

module.exports.enterData = async function(req, res){
    try{
        let user = await User.findById(req.user._id);

        let codeforces = await CodeForces.findOne({user: req.user._id});

        if(!codeforces)
        {
                codeforces = await CodeForces.create({
                Id: req.body.Id,
                rating: req.body.rating,
                user: user._id
            });

            let title;
            if(codeforces.rating < 1200){
                title = "Newbie";
            }
            else if(codeforces.rating < 1400)
            {
                title = "Pupil";
            }
            else if(codeforces.rating < 1600)
            {
                title = "Specialist";
            }
            else if(codeforces.rating < 1900)
            {
                title = "Expert";
            }
            else if(codeforces.rating < 2100)
            {
                title = "Candidate Master";
            }
            else if(codeforces.rating < 2300)
            {
                title = "Master";
            }
            else if(codeforces.rating < 2400)
            {
                title = "International Master";
            }
            else if(codeforces.rating < 2700)
            {
                title = "Grandmaster"
            }
            else
            {
                title = "International Grandmaster"
            }

            codeforces.title = title;

            user.codeforces = codeforces._id;
        }

        let rank;

        if(!user.rank)
        {
            rank = await Rank.create({
                user: user._id,
                gfg: 0,
                codeforces: codeforces.rating,
                codechef: 0
            });

            user.rank = rank._id;
        }else{

            rank = await Rank.findById(user.rank);
            rank.codeforces = codeforces.rating ;
        }

        let total = await calculator.calculateRating(rank);

        rank.rating = total;
        rank.save();
        user.save();
        codeforces.save();

        return res.redirect('back');
    }
    catch(err){
        console.log(err);
        return;
    }
}

module.exports.removeData = async function(req, res){

    try{
        let codeforces = await CodeForces.findOneAndDelete({user: req.user._id});

        let rank;

        if(codeforces){
            let user = await User.findByIdAndUpdate(req.user._id, {
                $unset: {codeforces: codeforces._id}
            });
            rank = await Rank.findOne({user: req.user._id});

            rank.codeforces = 0;

            let total = await calculator.calculateRating(rank);

            rank.rating = total;

            console.log(rank);
        }

        rank.save();

        return res.redirect('back');
    }catch(err){
        console.log(err);
        return;
    }
}
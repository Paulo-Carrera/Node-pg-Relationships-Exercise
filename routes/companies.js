const db = require("../db");
const express = require("express");
const router = new express.Router();
const ExpressError = require("../expressError");

router.get('/', async (req, res, next)=>{
    try{
        const result = await db.query(`
            SELECT * 
            FROM companies`);
        return res.json({companies : result.rows});
    }catch(err){
        return next(err);
    }
});

router.get('/:code', async (req, res, next)=>{
    try{
        const result = await db.query(`
            SELECT * FROM companies
            WHERE code = $1`, [req.params.code]);
        if(result.rows.length === 0){
            throw new ExpressError('Company not found', 404);
        }
        return res.json({company : result.rows[0]});
    }catch(err){
        return next(err);
    }
});

router.post('/', async (req, res, next)=>{
    try{
        const result = await db.query(
            `INSERT INTO companies
            (code, name, description)
            VALUES ($1, $2, $3)
            RETURNING code, name, description`, 
            [req.body.code, req.body.name, req.body.description]
        );
        return res.json({company : result.rows[0]});
    }catch(err){
        return next(err);
    }
});

router.put('/:code', async(req, res, next)=>{
    try{
        const result = await db.query(`
            UPDATE companies
            SET name = $1, description = $2
            WHERE code = $3
            RETURNING code, name, description`,
            [req.body.name, req.body.description, req.params.code]);
        if(result.rows.length === 0){
            throw new ExpressError('Company not found', 404);
        }
        return res.json({company : result.rows[0]});
    }catch(err){
        return next(err);
    }
});

router.delete('/:code', async(req, res, next)=>{
    try{
        const result = await db.query(`
            DELETE FROM companies
            WHERE code = $1
            RETURNING code, name, description`,
            [req.params.code]);
        if(result.rows.length === 0){
                throw new ExpressError('Company not found', 404);
        }
        return res.json({ status : 'deleted' });
    }catch(err){
        return next(err);
    }
});

module.exports = router;
const db = require("../db");
const express = require("express");
const router = new express.Router();
const ExpressError = require("../expressError");

router.get('/', async(req, res, next)=>{
    try{
        const result = await db.query(`
            SELECT *
            FROM invoices 
            ORDER BY id`);
        return res.json({invoices : result.rows});
    }catch(err){
        return next(err);
    }
});

router.get('/:id', async(req, res, next)=>{
    try{
        const result = await db.query(`
            SELECT * FROM invoices 
            WHERE id = $1`, [req.params.id]);
        if(result.rows.length === 0){
            throw new ExpressError('Invoice not found', 404);
        }
        return res.json({invoice : result.rows[0]});
    }catch(err){
        return next(err);
    }
});

router.post('/', async(req, res, next)=>{
    try{
        const result = await db.query(`
            INSERT INTO invoices (comp_code, amt)
            VALUES ($1, $2)
            RETURNING *`,
            [req.body.comp_code, req.body.amt]);
        return res.status(201).json({invoice : result.rows[0]});
    }catch(err){
        return next(err);
    }
});

router.put('/:id', async(req, res, next)=>{
    try{
        const result = await db.query(`
            UPDATE invoices
            SET amt = $1
            WHERE id = $2
            RETURNING *`,
            [req.body.amt, req.params.id]);
        if(result.rows.length === 0){
            throw new ExpressError('Invoice not found', 404);
        }
        return res.json({invoice : result.rows[0]});
    }catch(err){
        return next(err);
    }
});

router.delete('/:id', async(req, res, next)=>{
    try{
        const result = await db.query(`
            DELETE FROM invoices
            WHERE id = $1
            RETURNING *`,
            [req.params.id]);
        if(result.rows.length === 0){
            return new ExpressError('Invoice not found', 404);
        }
        return res.json({status : 'deleted'});
    }catch(err){
        return next(err);
    }
});

router.get('/companies/:code', async(req, res, next)=>{
    try{
        const companyCode = req.params.code;

        const companyResult = await db.query(
            `SELECT * FROM companies WHERE code = $1`, [companyCode]
        )

        if(companyResult.rows.length === 0){
            throw new ExpressError('Company not found', 404);
        }
        const company = companyResult.rows[0];

        const invoicesResult = await db.query(
            `SELECT * FROM invoices WHERE comp_code = $1` , [companyCode]
        )

        company.invoices = invoicesResult.rows.map(inv => inv);
        return res.json({company : company});
    }catch(err){
        return next(err);
    }
});

module.exports = router;
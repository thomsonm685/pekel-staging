

we're structuring this a diffrent way. Databases files and interactions are too abstracted and complicated in my opinion, so we're going to try to make this as simple as possible. 

They'll be an actions folder that exports an object with which you can call methods on to take actions (CRUD operations) on the database. 

The database is MongoDB, and assuming this is kept up to date, the data structure looks like this:
User:
    store_name: string
    tokens: 
        shopify_token: String 
        recharge_token: String 
        airtable_token: String 
        airtable_next_year_token: String
    old_orders:
        has_run: boolean
        can_run: boolean
        total_orders: integer
    connections: 
        airtable_connected: boolean 
        airtable_next_year_connected: boolean 
        recharge_connected: boolean 
    report_history:
        [           
            {
                date: timestamp
                order_count: integer
                successful: boolean     
            }          
        ]

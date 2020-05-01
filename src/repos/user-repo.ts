import data from '../data/user-db';
import { User } from '../models/user';
import { CrudRepository } from './crud-repo';
import {
    NotImplementedError, 
    ResourceNotFoundError, 
    ResourcePersistenceError,
    InternalServiceError
} from '../errors/errors';
import { PoolClient } from 'pg';
import { connectionPool } from '..';
import { mapUserResultSet } from '../util/result-set-mapper';

export class UserRepository implements CrudRepository<User> {

    baseQuery = `
        select
            au.id,
            au.username,
            au.password,
            au.first_name,
            au.last_name,
            au.email,
            ur.name as role_name
        from app_users au
        join user_roles ur
        on au.role_id = ur.id
    `;

    async getAll(): Promise<User[]> {

        let client: PoolClient;
        try {
            client = await connectionPool.connect();
            let sql = ``;
            let rs = await client.query(sql);
            return rs.rows;
        } catch (e) {
            throw new InternalServiceError();
        } finally {
            client && client.release();
        }

    
    }

    async getById(id: number): Promise<User> {

		let client: PoolClient;
        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery} where au.id = $1`;
            let rs = await client.query(sql);
            return mapUserResultSet(rs.rows[0]);
        } catch (e) {
            throw new InternalServiceError();
        } finally {
            client && client.release();
        }
        
    }

    async getUserByUniqueKey(key: string, val: string): Promise<User> {

        let client: PoolClient;
        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery} where au.${key} = $1`;
            let rs = await client.query(sql, [val]);
            return mapUserResultSet(rs.rows[0]);
        } catch (e) {
            throw new InternalServiceError();
        } finally {
            client && client.release();
        }
    
    }

    async getUserByCredentials(un: string, pw: string) {
        
        let client: PoolClient;
        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery} where au.username = $1 and au.password = $2`;
            let rs = await client.query(sql, [un,pw]);
            return mapUserResultSet(rs.rows[0]);
        } catch (e) {
            throw new InternalServiceError();
        } finally {
            client && client.release();
        }
    
    }

    async save(newUser: User): Promise<User> {
            
        let client: PoolClient;
        try {
            client = await connectionPool.connect();
            let sql = ``;
            let rs = await client.query(sql);
            return mapUserResultSet(rs.rows[0]);
        } catch (e) {
            throw new InternalServiceError();
        } finally {
            client && client.release();
        }
    
    }

    async update(updatedUser: User): Promise<boolean> {
        
        return new Promise<boolean>((resolve, reject) => {
        
            setTimeout(() => {
        
                let persistedUser = data.find(user => user.id === updatedUser.id);
        
                if (!persistedUser) {
                    reject(new ResourceNotFoundError('No user found with provided id.'));
                    return;
                }
                
                if (persistedUser.username != updatedUser.username) {
                    reject(new ResourcePersistenceError('Usernames cannot be updated.'));
                    return;
                }
        
                const conflict = data.find(user => {
                    if (user.id == updatedUser.id) return false;
                    return user.email == updatedUser.email; 
                });
        
                if (conflict) {
                    reject(new ResourcePersistenceError('Provided email is taken by another user.'));
                    return;
                }
    
                persistedUser = updatedUser;
    
                resolve(true);
        
            });

        });
    
    }

    deleteById(id: number): Promise<boolean> {

        return new Promise<boolean>((resolve, reject) => {
            reject(new NotImplementedError());
        });
    }

}

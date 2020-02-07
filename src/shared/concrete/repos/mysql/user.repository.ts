import { injectable } from 'inversify';
import { initMysql } from './connection.manager';
import { mapDbItems, userMapper } from './dbMapper';
import { IUserRepository } from '@repos/user.repository.interface';
import { User } from '@models/user';
import { Product_User } from './entity/product_user';

@injectable()
export class MySQLUserRepository implements IUserRepository {
  async add(user: User): Promise<boolean> {
    let connection: any;

    const organizationId = user.organizationId;
    const firstName = user.firstName;
    const lastName = user.lastName;
    const email = user.email;
    const phoneNumber = user.phoneNumber;
    try {
      connection = await initMysql();
      await connection.query(
        `INSERT INTO User(OrganizationId, FirstName, LastName, Email, PhoneNumber) VALUES (${organizationId} , '${firstName}' , '${lastName}','${email}','${phoneNumber}')`,
      );
      return true;
    } catch (err) {
      throw err;
    } finally {
      if (connection != null) {
        await connection.close();
      }
    }
  }

  async getOrganizationByUserEmail(_email: string): Promise<User[]> {
    let connection: any;
    try {
      connection = await initMysql();
      const result = await connection
        .createQueryBuilder()
        .select('user')
        .from(User, 'user')
        .where('user.Email = :email', { email: _email })
        .getOne();
      return result;
    } catch (err) {
      throw err;
    } finally {
      if (connection != null) {
        await connection.close();
      }
    }
  }

  async getUsersByProjectId(id: number): Promise<User[]> {
    let connection: any;
    try {
      connection = await initMysql();
      const results = await connection
        .getRepository(Product_User)
        .createQueryBuilder('product_user')
        .leftJoinAndSelect('product_user.user', 'users')
        .where('product_user.ProductId = :id', { id })
        .getMany();
      console.log(results);
      return results;
    } catch (err) {
      throw err;
    } finally {
      if (connection != null) {
        await connection.close();
      }
    }
  }

  get(_itemId: number): User {
    throw new Error('Method not implemented.');
  }
  update(_itemId: number, _item: User) {
    throw new Error('Method not implemented.');
  }
  delete(_itemId: number) {
    throw new Error('Method not implemented.');
  }
}

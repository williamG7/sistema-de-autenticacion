import bcrypt from 'bcrypt'
import DBLocal from 'db-local'
import crypto from 'node:crypto'
import { SALT_ROUNDS } from './config.js'
const { Schema } = new DBLocal({ path: './db' })

// creamos un esquema para los datos y los campos especificos
const User = Schema('User', {
    _id: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true }
})

// exportamos en una clase para crear usuarios y hacer el leogin 
export class UserRepository {
    static async create({ username, password }) {
        //Validació opcional usar zod(biblioteca de validaciones)
        // se hara de hacer mas estricto
        Validation.username(username)
        Validation.password(password)

        const user = User.findOne({ username })
        if (user) throw new Error('username ya existe')

        const id = crypto.randomUUID()

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        User.create({
            _id: id,
            username,
            password: hashedPassword
        }).save()
         return id
    }
    static async login({ username, password }) {
        Validation.username(username)
        Validation.password(password)

        const user = User.findOne({ username })

        if (!user) throw new Error('username no existe')

        const isValid = await bcrypt.compare(password, user.password)

        if (!isValid) throw new Error('password es invalido')

        const { password:_,...publicUser } = user

        return publicUser
    }
}

class Validation {
    static username(username) {
        if (typeof username != 'string') throw new Error('username tiene que ser una cadena');
        if (username.length < 3) throw new Error('Username superior a 3 caracteres');

    }
    static password(password) {
        if (typeof password != 'string') throw new Error('contraseña tiene que ser un string');
        if (password.length < 6) throw new Error('contraseña superior a 5 caracteres');
    }
}
import { Document, Model, ObjectId } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

interface IDocument extends Document {
  [key: string]: any;
}

interface ApiError {
  status: number;
  message: string;
}

enum StatusError {
  NotFound = 'Document not found',
  InvalidID = 'Invalid id detected',
  InvalidUpdateParams = 'Unallowed update parametrs detected',
  NothingProvided = 'Nothing has provided',
}

class Methods {
  /**
   * Switch to allow dev errors logs
   * @param {boolean} dev
   */
  private dev = true;

  /**
   * @param {Model<any>} model Mongoose model
   * @returns {Promise<Document[]>} Model objects
   * @throws {status: number, message: string}
   * @example
   * Method.getAllExistingModelDocuments(User)
    .then((users) => res.status(200).send(users))
    .catch((err: any) => res.status(err.status).send(err.message));
   */
  public async getAllExistingModelDocuments(model: Model<any>): Promise<Document[]> {
    try {
      const documents = await model.find({});
      if (documents.length == 0) throw { status: 404, message: StatusError.NotFound };
      return documents;
    } catch (err) {
      if (this.dev) console.log(err);
      if (err as ApiError) throw err;
      throw { status: 500, message: err.message };
    }
  }

  /**
   * @param {Model<any>} model Mongoose model
   * @param {Object} documentData Data of creating document
   * @returns {Promise<Document>} Created document
   * @example 
   * Method.putModelDocument(User, req.body)
    .then((user) => res.status(201).send(user))
    .catch((err: any) => res.status(err.status).send(err.message));
   */
  public async putModelDocument(
    model: Model<any>,
    documentData: { [key: string]: any },
  ): Promise<Document<any>> {
    const document: IDocument = new model(documentData);
    try {
      await document.save();
      return document;
    } catch (err) {
      if (this.dev) console.log(err);
      //? E11000 is duplicate mongo error code
      if ((err as { message: string }).message.includes('E11000'))
        throw { status: 409, message: 'Email is already taken' };
      throw { status: 500, message: err.message };
    }
  }

  /**
   * @param {Model<any>} model Mongoose model
   * @param {string} id String version of updating document ObjectID
   * @returns {Promise<Document>} Searched document
   * @throws {status: number, message: string}
   * @example
   * Method.getModelDocumentByID(User, req.params.id)
    .then((user) => res.status(200).send(user))
    .catch((err: any) => res.status(err.status).send(err.message));
   */
  public async getModelDocumentByID(model: Model<any>, id: string): Promise<Document<any>> {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) throw { status: 400, message: StatusError.InvalidID };

    try {
      const document: IDocument = await model.findById(id);
      if (!document) throw { status: 404, message: StatusError.NotFound };
      return document;
    } catch (err) {
      if (this.dev) console.log(err);
      if (err as ApiError) throw err;
      throw { status: 500, message: err.message };
    }
  }

  /**
   * @param {Model<any>} model Mongoose model
   * @param {String} id String version of updating document ObjectID
   * @param {Object} documentData Update information
   * @param {Array<string>} allowedUpdateParams Parametrs which can be edited
   * @returns {Promise<Document>} Document after update
   * @throws {status: number, message: string}
   * @example
   * Method.updateModelDocumentByID(User, req.params.id, req.body, ['age', 'name', 'password'])
    .then((user) => res.status(200).send(user))
    .catch((err: any) => res.status(err.status).send(err.message));
   */
  public async updateModelDocumentByID(
    model: Model<any>,
    id: string,
    documentData: { [key: string]: any },
    allowedUpdateParams: string[] = [],
  ): Promise<Document<any>> {
    try {
      //* If documentData contains unallowed parametrs
      if (!Object.keys(documentData).every((param: string) => allowedUpdateParams.includes(param)))
        throw { status: 403, message: StatusError.InvalidUpdateParams };

      //* If id is unvalid string ObjectID
      if (!id.match(/^[0-9a-fA-F]{24}$/)) throw { status: 400, message: StatusError.InvalidID };

      const document: IDocument = await model.findById(id);
      if (!document) throw { status: 404, message: StatusError.NotFound };

      //* Updates document via keys of documentData and it`s values
      Object.keys(documentData).forEach(
        (property: string) => (document[property] = documentData[property]),
      );

      await document.save();
      return document;
    } catch (err) {
      if (this.dev) console.log(err);
      if (err as ApiError) throw err;
      throw { status: 500, message: err.message };
    }
  }

  /**
   * @param {Model<any>} model Mongoose model
   * @param {String} id String version of deleting document ObjectID
   * @returns {Promise<Document>} Deleted document
   * @throws {status: number, message: string}
   * @example
   * Method.updateModelDocumentByID(User, req.params.id, req.body, ['age', 'name', 'password'])
    .then((user) => res.status(200).send(user))
    .catch((err: any) => res.status(err.status).send(err.message));
   */
  public async deleteModelDocumentByID(model: Model<any>, id: string): Promise<Document<any>> {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) throw { status: 400, message: StatusError.InvalidID };

    try {
      const document: IDocument = await model.findByIdAndDelete(id);
      if (!document) throw { status: 404, message: StatusError.NotFound };
      return document;
    } catch (err) {
      if (this.dev) console.log(err);
      if (err as ApiError) throw err;
      throw { status: 500, message: err.message };
    }
  }
  /**
   * @param {Model<any>} model Mongoose model
   * @param {{[key: string]: string; password: string}} credentials Password and search credential
   * @returns {Promise<String>} Token
   * @throws {status: number, message: string}
   * @example 
   * Method.loginByCredentialAndValidatePassword(User, req.body)
     .then((user) => {
      Method.generateAuthToken(user)
        .then((token) => {
          res.status(200).send({ user, token });
        })
        .catch((err: any) => {
          throw res.status(err.status).send(err.message);
        });
     })
    .catch((err: any) => res.status(err.status).send(err.message));
   */
  public async loginByCredentialAndValidatePassword(
    model: Model<any>,
    credentials: { [key: string]: string; password: string },
  ) {
    try {
      const credentialKeys = Object.keys(credentials);
      const credentialValues = Object.values(credentials);
      if (credentialKeys.includes('password') && credentialKeys.length === 2) {
        const searchCredential =
          credentialKeys[0] !== 'password'
            ? { [`${credentialKeys[0]}`]: credentialValues[0] }
            : { [`${credentialKeys[1]}`]: credentialValues[1] };

        const passwordCredential =
          credentialKeys[0] === 'password'
            ? { [`${credentialKeys[0]}`]: credentialValues[0] }
            : { [`${credentialKeys[1]}`]: credentialValues[1] };

        const document = await model.findOne(searchCredential);
        if (!document) throw { status: 401, message: 'Unable to login' };

        const isMatch = await bcrypt.compare(passwordCredential.password, document.password);
        if (!isMatch) throw { status: 401, message: 'Unable to login' };

        return document;
      } else {
        throw { status: 400, message: 'Invalid request' };
      }
    } catch (err) {
      if (this.dev) console.log(err);
      if (err as ApiError) throw err;
      throw { status: 500, message: err.message };
    }
  }

  /**
   * @param {Document} document Model document with ID and tokens properties
   * @returns {String} JSON web token
   * @example
   * Method.generateAuthToken(user).then((token) => console.log(token))
   */
  async generateAuthToken(document: IDocument) {
    try {
      const token = jwt.sign(
        {
          _id: document.id.toString(),
        },
        'SuperSecretCode',
      );
      /** @param {Array<{_id: ObjectId, token: string}>} tokens */
      document.tokens = document.tokens.concat({ token });
      await document.save();

      return token;
    } catch (err) {
      if (this.dev) console.log(err);
      throw err;
    }
  }
}

export { Methods as default };

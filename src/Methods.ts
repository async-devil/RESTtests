import { Document, Model } from 'mongoose';

interface IDocument extends Document {
  [key: string]: any;
}

enum StatusError {
  NotFound = 'Document not found',
  UnvalidID = 'Unvalid id detected',
  UnvalidUpdateParams = 'Unallowed update parametrs detected',
}

class Methods {
  /**
   * Switch to allow dev errors logs
   * @param {boolean} dev
   */
  private dev = false;

  /**
   * @param {Model<any>} model Mongoose model
   * @returns {Promise<Document[]>} Model objects
   * @throws {status: number, error: string}
   * @example
   * Method.getAllExistingModelDocuments(User)
    .then((users) => res.status(200).send(users))
    .catch((err: any) => res.status(err.status).send(err.error));
   */
  public async getAllExistingModelDocuments(model: Model<any>): Promise<Document[]> {
    try {
      const documents = await model.find({});
      if (documents.length == 0) throw { status: 404, error: StatusError.NotFound };
      return documents;
    } catch (err) {
      if (this.dev) console.log(err);
      throw { status: 500, error: err.message };
    }
  }

  /**
   * @param {Model<any>} model Mongoose model
   * @param {Object} documentData Data of creating document
   * @returns {Promise<Document>} Created document
   * @example 
   * Method.putModelDocument(User, req.body)
    .then((user) => res.status(201).send(user))
    .catch((err: any) => res.status(err.status).send(err.error));
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
      throw { status: 500, error: err.message };
    }
  }

  /**
   * @param {Model<any>} model Mongoose model
   * @param {string} id String version of updating document ObjectID
   * @returns {Promise<Document>} Searched document
   * @throws {status: number, error: string}
   * @example
   * Method.getModelDocumentByID(User, req.params.id)
    .then((user) => res.status(200).send(user))
    .catch((err: any) => res.status(err.status).send(err.error));
   */
  public async getModelDocumentByID(model: Model<any>, id: string): Promise<Document<any>> {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) throw { status: 400, error: StatusError.UnvalidID };

    try {
      const document: IDocument = await model.findById(id);
      if (!document) throw { status: 404, error: StatusError.NotFound };
      return document;
    } catch (err) {
      if (this.dev) console.log(err);
      throw { status: 500, error: err.message };
    }
  }

  /**
   * @param {Model<any>} model Mongoose model
   * @param {String} id String version of updating document ObjectID
   * @param {Object} documentData Update information
   * @param {Array<string>} allowedUpdateParams Parametrs which can be edited
   * @returns {Promise<Document>} Document after update
   * @throws {status: number, error: string}
   * @example
   * Method.updateModelDocumentByID(User, req.params.id, req.body, ['age', 'name', 'password'])
    .then((user) => res.status(200).send(user))
    .catch((err: any) => res.status(err.status).send(err.error));
   */
  public async updateModelDocumentByID(
    model: Model<any>,
    id: string,
    documentData: { [key: string]: any },
    allowedUpdateParams: string[] = [],
  ): Promise<Document<any>> {
    //* If documentData contains un
    if (!Object.keys(documentData).every((param: string) => allowedUpdateParams.includes(param)))
      throw { status: 403, error: StatusError.UnvalidUpdateParams };

    //* If id is unvalid string ObjectID
    if (!id.match(/^[0-9a-fA-F]{24}$/)) throw { status: 400, error: StatusError.UnvalidID };

    const document: IDocument = await model.findById(id);
    if (!document) throw { status: 404, error: StatusError.NotFound };

    //* Updates document via keys of documentData and it`s values
    Object.keys(documentData).forEach(
      (property: string) => (document[property] = documentData[property]),
    );

    try {
      await document.save();
      return document;
    } catch (err) {
      if (this.dev) console.log(err);
      throw { status: 500, error: err.message };
    }
  }

  /**
   * @param model Mongoose model
   * @param id String version of deleting document ObjectID
   * @returns {Promise<Document>} Deleted document
   * @throws {status: number, error: string}
   * @example
   * Method.updateModelDocumentByID(User, req.params.id, req.body, ['age', 'name', 'password'])
    .then((user) => res.status(200).send(user))
    .catch((err: any) => res.status(err.status).send(err.error));
   */
  public async deleteModelDocumentByID(model: Model<any>, id: string): Promise<Document<any>> {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) throw { status: 400, error: StatusError.UnvalidID };

    try {
      const document: IDocument = await model.findByIdAndDelete(id);
      if (!document) throw { status: 404, error: StatusError.NotFound };
      return document;
    } catch (err) {
      if (this.dev) console.log(err);
      throw { status: 500, error: err.message };
    }
  }
}

export { Methods as default };

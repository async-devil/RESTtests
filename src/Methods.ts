import { Document, Model } from 'mongoose';

interface IDocument extends Document {
  [key: string]: any;
}

class Methods {
  /**
   * @param {Model<any>} model Mongoose model
   * @returns {Promise<Document[]>} Model objects
   * @throws 404 HTTP status code
   * @example
   * Method.getAllExistingModelDocuments(User)
    .then((users: IUser[]) => res.send(users))
    .catch((err: any) => res.status(typeof err == 'number' ? err : 500).send());
   */
  public async getAllExistingModelDocuments(model: Model<any>): Promise<Document[]> {
    const documents = await model.find({});
    if (documents.length == 0) throw 404;
    return documents;
  }

  /**
   * @param {Model<any>} model Mongoose model
   * @param {Object} documentData Data of creating document
   * @returns {Promise<Document>} Created document
   * @example 
   * Method.putModelDocument(User, req.body)
    .then((user) => res.status(201).send(user))
    .catch((err: any) => res.status(typeof err == 'number' ? err : 500).send());
   */
  public async putModelDocument(
    model: Model<any>,
    documentData: { [key: string]: any },
  ): Promise<Document<any>> {
    const document: IDocument = new model(documentData);
    return await document.save();
  }

  /**
   * @param {Model<any>} model Mongoose model
   * @param {string} id String version of updating document ObjectID
   * @returns {Promise<Document>} Searched document
   * @throws 404 or 400 HTTP status codes
   * @example
   * Method.getModelDocumentByID(User, req.params.id)
    .then((user) => res.send(user))
    .catch((err: any) => res.status(typeof err == 'number' ? err : 500).send());
   */
  public async getModelDocumentByID(model: Model<any>, id: string): Promise<Document<any>> {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) throw 400;

    const document: IDocument = await model.findById(id);
    if (!document) throw 404;

    return document;
  }

  /**
   * @param {Model<any>} model Mongoose model
   * @param {String} id String version of updating document ObjectID
   * @param {Object} documentData Update information
   * @param {Array<string>} allowedUpdateParams Parametrs which can be edited
   * @returns {Promise<Document>} Document after update
   * @throws 404 or 400 HTTP status codes
   * @example
   * Method.updateModelDocumentByID(User, req.params.id, req.body, ['age', 'name'])
    .then((user) => res.status(200).send(user))
    .catch((err: any) => res.status(typeof err == 'number' ? err : 500).send());
   */
  public async updateModelDocumentByID(
    model: Model<any>,
    id: string,
    documentData: { [key: string]: any },
    allowedUpdateParams: string[] = [],
  ): Promise<Document<any>> {
    if (!Object.keys(documentData).every((param: string) => allowedUpdateParams.includes(param)))
      throw 400;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) throw 400;

    const document: IDocument = await model.findById(id);
    if (!document) throw 404;

    Object.keys(documentData).forEach(
      (property: string) => (document[property] = documentData[property]),
    );
    document.save();

    return document;
  }

  /**
   * @param model Mongoose model
   * @param id String version of deleting document ObjectID
   * @returns {Promise<Document>} Deleted document
   * @throws 404 or 400 HTTP status codes
   * @example
   * Method.deleteModelDocumentByID(User, req.params.id)
    .then((user) => res.status(200).send(user))
    .catch((err) => res.status(typeof err == 'number' ? err : 500).send());
   */
  public async deleteModelDocumentByID(model: Model<any>, id: string): Promise<Document<any>> {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) throw 400;

    const document: IDocument = await model.findByIdAndDelete(id);
    if (!document) throw 404;

    return document;
  }
}

export { Methods as default };

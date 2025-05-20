"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SqliteRequestLogRepository = void 0;
const typeorm_1 = require("typeorm");
const RequestLogEntity_1 = require("../entities/RequestLogEntity");
class SqliteRequestLogRepository {
    constructor() {
        this.dataSource = new typeorm_1.DataSource({
            type: 'sqlite',
            database: 'database.sqlite',
            synchronize: true,
            logging: false,
            entities: [RequestLogEntity_1.RequestLogEntity],
        });
    }
    async initialize() {
        await this.dataSource.initialize();
    }
    async save(log) {
        const repository = this.dataSource.getRepository(RequestLogEntity_1.RequestLogEntity);
        const entity = new RequestLogEntity_1.RequestLogEntity();
        Object.assign(entity, log);
        await repository.save(entity);
    }
}
exports.SqliteRequestLogRepository = SqliteRequestLogRepository;

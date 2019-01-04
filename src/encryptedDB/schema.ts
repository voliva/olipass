import * as Realm from 'realm';
import { Site } from '../redux/sites/state';

const SiteSchema: Realm.ObjectSchema = {
    name: 'Site',
    primaryKey: 'id',
    properties: {
        id: 'string',
        name: 'string?',
        website: 'string?',
        username: 'string?',
        password: 'string?',
        notes: 'string?',
        updatedAt: 'date',
        lastVisitAt: 'date?',
        deletedAt: 'date?',
        usernameUpdtAt: 'date',
        passwordUpdtAt: 'date',
        notesUpdtAt: 'date',
    }
}

export const mapSiteToModel = (site: Site) => ({
    id: site.id,
    name: site.name,
    website: site.website,
    username: site.username.value,
    password: site.password.value,
    notes: site.notes.value,
    updatedAt: new Date(site.updatedAt),
    lastVisitAt: site.lastVisitAt && new Date(site.lastVisitAt),
    deletedAt: site.deletedAt && new Date(site.deletedAt),
    usernameUpdtAt: new Date(site.username.updatedAt),
    passwordUpdtAt: new Date(site.password.updatedAt),
    notesUpdtAt: new Date(site.notes.updatedAt)
});
export const mapModelToSite = (model: any): Site => ({
    id: model.id,
    name: model.name,
    website: model.website,
    username: {
        value: model.username,
        updatedAt: model.usernameUpdtAt.getTime()
    },
    password: {
        value: model.password,
        updatedAt: model.passwordUpdtAt.getTime()
    },
    notes: {
        value: model.notes,
        updatedAt: model.notesUpdtAt.getTime()
    },
    updatedAt: model.updatedAt.getTime(),
    lastVisitAt: model.lastVisitAt && model.lastVisitAt.getTime(),
    deletedAt: model.deletedAt && model.deletedAt.getTime()
});

export default [ SiteSchema ];
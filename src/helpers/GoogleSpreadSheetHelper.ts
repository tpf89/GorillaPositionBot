import { GoogleSpreadsheet} from 'google-spreadsheet';
import { IShow } from '../models/IShow';
import { DateTime } from 'luxon';
import { IWorkSheet } from '../models/IWorkSheet';

export class GoogleSpreadSheetHelper {
    private doc: GoogleSpreadsheet;
    private minutesBefore: number;

    constructor(sheetId: string, authKey: string, minutesBefore: number) {
        this.doc = new GoogleSpreadsheet(sheetId);
        this.doc.useApiKey(authKey);
        this.minutesBefore = minutesBefore;
    }

    public async getShows(workSheets: Array<IWorkSheet>): Promise<Array<IShow>> {
        const weeklyShows: Array<IShow> = [];
        const res = await this.doc.loadInfo();

        for (let i = 0; i < workSheets.length; i++) {
            const workSheet = workSheets[i];
            const weeklyShow = await this.getShow(workSheet);

            if (weeklyShow === null) {
                continue;
            }

            weeklyShows.push(weeklyShow as IShow);
        }

        return weeklyShows;
    }

    private async getShow(workSheet: IWorkSheet): Promise<IShow|null> {
        const sheet = this.doc.sheetsByTitle[workSheet.Title];

        const rows = await sheet.getRows();

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const show: IShow = {
                Title: workSheet.IsWeekly ? workSheet.Title : row.title,
                Date: row.exceptionDate ? 
                    DateTime.fromFormat(row.exceptionDate, 'dd.LL.yyyy HH:mm:ss', { zone: 'America/New_York' }) : 
                    DateTime.fromFormat(row.defaultDate, 'dd.LL.yyyy HH:mm:ss', { zone: 'America/New_York' }),
                Role: row.role
            }

            if (!show.Date) {
                continue;
            }

            if (workSheet.IsWeekly) {
                continue;
            }

            const now = DateTime.now().setZone('America/New_York');
            const diff = show.Date.diff(now, ["days", "hours", "minutes"]).toObject();

            //console.log(show);
            //console.log(diff);

            if (diff.days === 0 && diff.hours === 0 && diff.minutes && diff.minutes < this.minutesBefore + 1) {
                show.MinutesUntil = diff.minutes;
                return show;
            }
        }

        return null;
    }
}
﻿import { ID } from '../id.model';
import { AliasTable } from '../link/alias-table.model';

export class Paragraph {
    paragraph_id: ID;
    succeeding_id: ID;
    text: string;
    links: AliasTable;
    note: string;
}

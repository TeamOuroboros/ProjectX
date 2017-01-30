﻿import { Injectable } from '@angular/core';

import { ApiService } from '../../shared/api.service';

@Injectable()
export class WikiService {
    constructor(private apiService: ApiService) { }

    //All the GETS
    public getWikiInformation(wiki_id: string) {
        this.apiService.send({
            action: 'get_wiki_information',
            wiki_id: wiki_id
        });
    }

    public getWikiHierarchy(wiki_id: string) {
        this.apiService.send({
            action: 'get_wiki_hierarchy',
            wiki_id: wiki_id
        });
    }

    public getWikiSegmentHierarchy(segment_id: string) {
        this.apiService.send({
            action: 'get_wiki_segment_hierarchy',
            segment_id: segment_id
        });
    }

    public getWikiSegment(sid: string)
    {
        this.apiService.send({
           
            "action": "get_wiki_segment",
            "segment_id": sid
        });
    }
    public getWikiPage(page_id: string) {
        this.apiService.send({
            action: 'get_wiki_page',
            page_id: page_id
        });
    }

    //EDITS
    //update type: set_title;
    public editSegment(segment_id: string, update_type:string, new_text: string)
    {
        this.apiService.send({
                action: 'edit_segment',
                "segment_id": segment_id,
                "update": {
                    "update_type": "set_title",
                    "title": new_text
                    }
                });
    }

    public editPage(page_id: string, update_type: string, new_text: string)
    {
        this.apiService.send({

            "action": "edit_page",
            "page_id": page_id,
            "update": {
                "update_type": update_type,
                "title": new_text
            }
        });
    }

    //update_type: {"set_title" | "set_text"

    public editHeading(page_id: string, heading_title:string,update_type: string, new_text: string)
    {
        this.apiService.send({

            "action": "edit_heading",
            "page_id": page_id,
            "heading_title": heading_title,



            "update": {
                "update_type": update_type,
                "text": new_text
            }
        });
    }

    //ADD
    public addSegment(title:string, pid:string)
    {
        this.apiService.send({

            "action": "add_segment",
            "title": title,
            "parent_id": pid
        });
    }

    public addTempleteHeading(title:string,sid:string)
    {
        this.apiService.send({
            "action": "add_template_heading",
            "title": title,
            "segment_id": sid
        });
    }

    //parent_id == segment_id
    public addPage(title:string,sid:string)
    {
        this.apiService.send({

            "action": "add_page",
            "title": title,
            "parent_id": sid
        });
    }

    public addHeading(title: string, page_id: string)
    {
        this.apiService.send({
            
            "action": "add_heading",
            "title": title,
            "page_id": page_id,
            "index": 0
        });
    }

    //CREATES
    public createWiki(title:string,summary:string)
    {
        this.apiService.send(
            {
                
                "action": "create_wiki",
                "title": title,
                "summary": summary
            });
    }


}
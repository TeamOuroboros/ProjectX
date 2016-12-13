﻿import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs/Rx';

// Story
import { Story } from '../models/story.model';
import { ChapterSummary } from '../models/chapter-summary.model';
import { Chapter } from '../models/chapter.model';
import { Paragraph } from '../models/paragraph.model';

// Wiki
import { Wiki } from '../models/wiki.model';
import { PageSummary } from '../models/page-summary.model';
import { Page } from '../models/page.model';
import { Section } from '../models/section.model';

import { WebSocketService } from './websocket.service';

const url: string = 'ws://localhost:8080/ws/v2/test';

@Injectable()
export class ParserService {
    // Story
    public paragraph: Paragraph = { 'id': '', 'text': '', 'statistics': '' };
    public chapter: Chapter = { 'id': '', 'title': '', 'statistics': '', 'paragraphs': [this.paragraph] };
    public selectedChapter: ChapterSummary = { 'id': '', 'title': '' };
    public story: Story = { 'id': '', 'title': '', 'owner': '', 'coauthors': [], 'statistics': '', 'settings': '', 'synopsis': '', 'wiki': { 'id': '', 'title': '' }, 'chapters': [this.chapter] };

    // Wiki
    public wiki: Wiki = { 'id': '', 'title': '', 'segments': [], 'pages': [] };

    public data = {
        'name': '',
        'display': '',
        'wikiDisplay': '',
        'story': this.story,
        'storySelected': false,
        'selectedChapter': this.selectedChapter,
        'chapter': this.chapter,
        'paragraph': this.paragraph,

        'wiki': this.wiki,
        'wikiSelected': false,
        'selectedPage': { 'id': '' },
        'selectedSegment': {},

        'inflight': false
    }

    public outgoing = {};
    public message_id: number = 0;
    public messages: Subject<string>;

    constructor(socket: WebSocketService) {
        this.messages = <Subject<string>>socket
            .connect(url).map((response: MessageEvent): string => response.data);
    }

    public receive(): Observable<string> {
        return this.messages.map((response: string) => {
            this.data.inflight = false;

            let reply = JSON.parse(response);
            let message_id: number = reply.reply_to;
            let action: string = this.outgoing[message_id];

            switch (action) {
                //message for editor
                case 'get_user_info':
                    this.data.name = reply.name;
                    this.send({ 'action': 'load_story_with_chapters', 'story': reply.stories[0].id });
                    break;

                case 'load_story_with_chapters':
                    let chapter: ChapterSummary = reply.chapters[0];
                case 'load_story':
                    this.data.story = reply;
                    this.data.storySelected = true;
                    this.data.wikiSelected = true;
                    this.setStoryDisplay();
                    this.send({ 'action': 'get_wiki_hierarchy', 'wiki': reply.wiki });
                    break;

                case 'get_all_chapters':
                    this.data.story.chapters = reply;
                    this.send({ 'action': 'load_chapter_with_paragraphs', 'chapter': reply[0].id });
                    break;

                case 'load_chapter_with_paragraphs':
                    this.data.display = '';
                    this.data.paragraph = reply.paragraphs[0];
                    for (let i = 0; i < reply.paragraphs.length; i++) {
                        this.data.display += '<p>' + reply.paragraphs[i].text + '</p>';
                    }
                case 'load_chapter':
                    this.data.chapter = reply;
                    break;

                case 'get_all_paragraphs':
                    this.data.display = '';
                    this.data.paragraph = reply[0];
                    this.data.chapter.paragraphs = reply;
                    for (let i = 0; i < reply.paragraphs.length; i++) {
                        this.data.display += '<p>' + reply.paragraphs[i].text + '</p>';
                    }
                    break;

                case 'load_paragraph':
                    this.data.paragraph = reply;
                    this.data.display = reply.text;
                    break;

                //message for wiki
                case 'get_wiki_hierarchy':
                    this.data.wiki = reply.hierarchy;
                    this.setWikiDisplay();
                    break;
                case 'load_wiki_page_with_sections':
                    this.data.wikiSelected = false;
                    this.data.selectedPage = reply.wiki_page;
                    this.data.selectedSegment = this.getSegment(reply.wiki_page);
                    this.setPageDisplay(reply.wiki_page);
                    break;

                default:
                    console.log('Unknown action: ' + action)
                    break;
            }
            delete this.outgoing[message_id];
            return action;
        });
    }

    /**
     * Set the disply for the story
     */
    public setStoryDisplay() {
        this.data.display =
            '<h1>Title</h1><h2>' + this.data.story.title + '</h2><br>' +
            '<h1>Owner</h1><h2>' + this.data.story.owner + '</h2><br>' +
            '<h1>Synopsis</h1><h2>' + this.data.story.synopsis + '</h2><br>' +
            '<h1>Chapters</h1>';
        for (let chapter of this.data.story.chapters) {
            this.data.display += '<h2>' + chapter.title + '</h2>';
        }
        this.data.display += '<br>';
    }
    /**
     * Set the disply for the wiki
     */
    public setWikiDisplay() {
        this.data.wikiDisplay =
            '<h1>Title</h1><h2>' + this.data.wiki.title + '</h2><br>' +
            '<h1>Segments</h1>';
        for (let segment of this.data.wiki.segments) {
            this.data.wikiDisplay += '<h2>' + segment.title + '</h2>';
        }
        this.data.wikiDisplay += '<br>';
    }

    /**
     * Set the wiki diplay to a specific page
     * @param page - page to be displayed
     */
    public setPageDisplay(page: Page) {
        this.data.wikiDisplay =
            '<h1>Name</h1><h2>' + page.title + '</h2><br>' +
            '<h1>Aliases</h1>';
        for (let alias of page.aliases) {
            this.data.wikiDisplay += '<h2>' + alias + '</h2>';
        }
        this.data.wikiDisplay += '<br>';
        for (let section of page.sections) {
            this.data.wikiDisplay += '<h1>' + section.title + '</h1>';
            for (let paragraph of section.paragraphs) {
                this.data.wikiDisplay += '<h2>' + paragraph.text + '</h2>';
            }
            this.data.wikiDisplay += '<br>';
        }
        this.data.wikiDisplay += '<h1>References</h1>';
        for (let reference of page.references) {
            this.data.wikiDisplay += '<h2>' + reference + '</h2>';
        }
        this.data.wikiDisplay += '<br>';
    }

    /**
     * Find segment that contain the wiki page
     * @param page 
     */
    public getSegment(page: any) {
        for (let segment of this.data.wiki.segments) {
            for (let pageCheck of segment.pages) {
                if (page.id == pageCheck.id) return segment;
            }
        }
        return {};
    }

    public send(message: any) {
        message.message_id = ++this.message_id;
        this.outgoing[message.message_id] = message.action;

        this.data.inflight = true;
        this.messages.next(message);
    }
}
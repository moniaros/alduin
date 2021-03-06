import * as React from "react";
import * as electron from "electron";

import { ComponentsRefs } from "./../../components-refs";
import { CustomComponent } from "./../custom-component";
import { FeedStorage } from "./../../storage";

export class Article extends CustomComponent<ArticleProps, ArticleState> {
    constructor(props: ArticleProps) {
        super();

        this.props = props;

        this.state = {
            read: this.props.read,
            selected: false
        };

        this.handleSelect = this.handleSelect.bind(this);
    }

    render() {
        const summary = this.props.content.replace(/<a( href=".*"){0,1}>/, "").replace(/<\/a>/, "").substring(0, 197).replace("\n", " ");

        const toUseDate = new Date(this.props.date);
        const articleDate = new Date(this.props.date);
        const actualDate = new Date();
        articleDate.setHours(0, 0, 0, 0);
        actualDate.setHours(0, 0, 0, 0);

        let dateArticle: string = "";

        if (articleDate.getTime() == actualDate.getTime()) {
            dateArticle = toUseDate.toLocaleTimeString(electron.remote.app.getLocale());
        } else {
            dateArticle = toUseDate.toLocaleDateString(electron.remote.app.getLocale());
        }

        return (
            <li onClick={this.handleSelect} className={(!this.state.read ? "unread" : "") + (this.state.selected ? "selected" : "")}>
                <h3><span>{this.props.title}</span><span>{dateArticle}</span></h3>
                <p dangerouslySetInnerHTML={{ "__html": `${summary}...` }} >
                </p>
            </li>
        );
    }

    handleSelect(event: React.MouseEvent<HTMLLIElement>) {
        if (!this.state.read) {
            this.editState({ read: true });
            this.markAsRead(() => {
                FeedStorage.store();
                ComponentsRefs.feedList.updateTrayIcon();
            });
        }

        ComponentsRefs.articleList.articleComponents.forEach(articleComponent => articleComponent.editState({ selected: false }));
        this.editState({ selected: true });

        ComponentsRefs.content.editState({
            content: `
                <h3>${this.props.title}</h3>
                <div>${this.props.content}</div>
            `,
            podcast: this.props.podcast
        });

        ComponentsRefs.content.resetScrollbar();

        document.querySelector("body").classList.add("show-article");
    }

    markAsRead(callback: () => any = () => { return null; }) {
        const articleFound = ComponentsRefs.feedList.selectedFeed.state.articles.find(article => {
            return article.id === this.props.id;
        });
        articleFound.read = true;
        ComponentsRefs.feedList.forceUpdate(callback);
    }
}

interface ArticleProps {
    id: string;
    title: string;
    content: string;
    link: string;
    date: number;
    read: boolean;
    podcast: string;
}
interface ArticleState {
    read: boolean;
    selected: boolean;
}

import React from "react";
import { FloatingPanel } from "./FloatingPanel";
import works from '@/data/portfolio.json';

export const Works = ({
  isVisible,
  onCloseClick,
}: {
  isVisible: boolean;
  onCloseClick: () => void;
}) => (
  <FloatingPanel
    isVisible={isVisible}
    onCloseClick={onCloseClick}
  >
    <FloatingPanel.Header>
      <FloatingPanel.HeaderBackButton onClick={onCloseClick}>Close</FloatingPanel.HeaderBackButton>
      <div className="works__headline"><span>Works</span></div>
    </FloatingPanel.Header>
    <FloatingPanel.Content>
      <div className="works__list">
        {works.map(({
          name,
          caption,
          image,
          slug,
          description,
          permalink
        }) => (
          <React.Fragment key={slug}>
            <article className="works__list-item work">
              <div className="work__header">
                <h2 className="work__title">{name}</h2>
                <span className="work__caption">{caption}</span>
              </div>
              <img className="work__image" src={image} alt={name} />
              <div className="work__content">
                <div className="work__description"
                  data-gtm-el="works-description"
                  data-gtm-el-key={slug}
                  dangerouslySetInnerHTML={{ __html: description }}
                >
                </div>
                <div className="work__actions">
                  <a
                    className="button"
                    href={permalink}
                    target="_blank"
                    data-gtm-el="works-permalink"
                    data-gtm-el-key={slug}
                  >
                    <span>View Live</span>
                  </a>
                </div>
              </div>
            </article>
            <div className="works__list-item-separator works__list-item-separator--full-width" data-shape-divider="arrow-down"></div>
          </React.Fragment>
        ))}
        <div className="works__list-footer">
          <button onClick={onCloseClick} className="works__close-panel-footer" type="button">
            <span>Close</span>
          </button>
        </div>
      </div>
    </FloatingPanel.Content>
  </FloatingPanel>
);

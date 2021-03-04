import React, { useState } from "react";
import SearchField from "../SearchField/SearchField";
import PreviewCard from "../PreviewCard/PreviewCard";
import useFetch from "../../api/useFetch";
import { activitiesResource, techniquesResource } from "../../api/constants";
import { CircularLoader, NoticeBox } from "@dhis2/ui-core";

import styles from "./DoPage.module.css";
import { activity, technique } from "../types";

const DoPage = () => {
  const [search, setSearch] = useState<string>("");
  const [techniques, setTechniques] = useState<technique[] | undefined>(
    undefined
  );
  const [activities, setActivities] = useState<activity[] | undefined>(
    undefined
  );

  const handleTechnique = (newState: technique[]) => {
    if (newState !== techniques) {
      setTechniques(newState);
    }
  };

  const handleActivities = (newState: activity[]) => {
    if (newState !== activities) {
      setActivities(newState);
    }
  };

  const {
    isLoading: techniquesIsLoading,
    error: techniquesError,
    response: techniquesResponse,
  } = useFetch(techniquesResource);

  const {
    isLoading: activitiesIsLoading,
    error: activitiesError,
    response: activitiesResponse,
  } = useFetch(activitiesResource);

  handleTechnique(techniquesResponse);
  handleActivities(activitiesResponse);

  const dataToShow =
    techniques && activities
      ? [...techniques, ...activities]
      : techniques && !activities
      ? techniques
      : !techniques && activities
      ? activities
      : [];

  const filteredData =
    search !== "" && dataToShow.length !== 0
      ? dataToShow.filter(
          (item: any) =>
            item.title.toLowerCase().includes(search.toLowerCase()) ||
            item.intro.toLowerCase().includes(search.toLowerCase())
        )
      : dataToShow;

  return (
    <section className={styles.doPageContainer}>
      <h1>What do you want support with?</h1>
      <SearchField
        placeHolder={"Search for project type, technique, etc..."}
        handleSearch={setSearch}
      />
      {techniquesError && !activitiesError ? (
        <NoticeBox error title="Could not retrive techniques">
          There was a problem fetching the techniques. Please try again later.
        </NoticeBox>
      ) : !techniquesError && activitiesError ? (
        <NoticeBox error title="Could not retrive activities">
          There was a problem fetching the activities. Please try again later.
        </NoticeBox>
      ) : techniquesError && activitiesError ? (
        <NoticeBox error title="Could not retrive data">
          There was a problem fetching the activities and techniques. Please try
          again later.
        </NoticeBox>
      ) : null}
      <article className={styles.cardContainer}>
        {activitiesIsLoading && techniquesIsLoading ? (
          <CircularLoader />
        ) : filteredData.length !== 0 ? (
          filteredData.map((item: any) => {
            return (
              <PreviewCard
                key={item.id}
                title={item.title}
                intro={item.intro}
                id={item.slug ? item.slug : item.id}
                resource={item.slug ? "techniques" : "activities"}
              />
            );
          })
        ) : (
          <NoticeBox title="No matches">
            Could not find any activities or techniques.
          </NoticeBox>
        )}
      </article>
    </section>
  );
};

export default DoPage;

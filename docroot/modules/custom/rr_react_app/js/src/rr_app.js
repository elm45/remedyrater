import React, { useEffect, useState } from "react";

// The display for each item in the list.
// If this were more complex, it could be refactored into it's own component loaded.
const UnListItem = ({ drupal_internal__nid, title }) => (
  <div>
    <a href={`/node/${drupal_internal__nid}`}>{title}</a>
  </div>
);

const BootstrapCard = ({title, content, cta_src, cta_text}) => (
  <div class="card">
    <div class="card-body">
      {title.length > 0 && <h5 class="card-title">{title}</h5>}
      {content.length > 0 && <div class="card-text">{content}</div>}
    </div>
    {cta_src &&
      <div class="card-footer text-muted">
        <a href={`/node/${cta_src}`} class="btn btn-primary">{cta_text ? cta_text : 'Read more'}</a>
      </div>
    }
  </div>
);

// The content to display if not data is found.
const NoData = () => (
  <div>No content found.</div>
);

// Validate the data before using it.
function isValidData(data) {
  if (data === null) {
    return false;
  }
  if (data.data === undefined ||
    data.data === null ||
    data.data.length === 0 ) {
    return false;
  }
  return true;
}

//The main app that gets loaded into the index.js.
const RemedyRaterApp = () => {
  // Use content state variable to keep track of loaded data.
  const [content, setContent] = useState(false);
 // Use filter state vairable to manage filtering content.
  const [filter, setFilter] = useState(null);

  // Ensure API request only happens the first time the component is rendered
  // by using an empty array as the second argument.
  useEffect(() => {
    // Relative path to the API endpoint.
    const API_ROOT = '/jsonapi/';
    // The arguments for the date.
    const DATA_ARGS = 'node/page?fields[node--page]=id,drupal_internal__nid,title,body&sort=-created&page[limit]=10';
    // The full path we are fetching from.
    const url = `${API_ROOT}${DATA_ARGS}`;

    const headers = new Headers({
      Accept: 'application/vnd.api+json',
    });

    // Fetch and validate the data - throw an error if not valid.
    fetch(url, {headers})
    .then((response) => response.json())
    .then((data) => {
      if (isValidData(data)) {
        setContent(data.data)
      }
    })
    .catch(err => console.log('There was an error accessing the API', err));
  }, []);


  return (
    <div>
      {content ? (
        <>
         {/* @TODO Break out into input component. */}
          <div class="form-group d-flex align-items-end">
            <label htmlFor="filter" class="flex-shrink-0 font-weight-bold">Type to filter:</label>
            <input
              class="form-control flex-grow-1 ml-2"
              type="text"
              name="filter"
              placeholder="Start typing ..."
              onChange={(event => setFilter(event.target.value.toLowerCase()))}
            />
          </div>
          <div class="row">
          {
            content.filter((item) => {
              if (!filter) {
                return item;
              }
              // @TODO Needs checking - if no body in node, `item.attributes.body.value` breaks app.
              if (filter && (item.attributes.title.toLowerCase().includes(filter) || item.attributes.body.value.toLowerCase().includes(filter))) {
                return item;
              }
            }).map(
              (item) =>
                <div class="col-6 my-3 d-flex align-items-stretch">
                  <BootstrapCard
                    key={item.id}
                    title={item.attributes.title}
                    content={item.attributes.body.summary}
                    cta_src={item.attributes.drupal_internal__nid}
                    cta_text='Full article'
                  />
                </div>
            )
          }
          </div> {/* End row */}
        </>
      ) : (
          <NoData />
        )}
    </div>
  );

}

export default RemedyRaterApp;

import React, { useEffect, useState } from "react";
import NodeAdd from "./NodeAdd";
import NodeEdit from "./NodeEdit";
import NodeDelete from "./NodeDelete";
import { brotliDecompressSync } from "zlib";

// console.log(drupalSettings);

/**
 * Helper function to validate data retrieved from JSON:API.
 */
function isValidData(data) {
  if (data === null) {
    return false;
  }
  if (data.data === undefined ||
    data.data === null ||
    data.data.length === 0) {
    return false;
  }
  return true;
}

/**
 * Component for displaying an individual page, with optional admin features.
 */
const NodeItem = ({ id, drupal_internal__nid, title, body, contentList, updateContent, description, cta_href, cta_text }) => {
  const [showAdminOptions, setShowAdminOptions] = useState(false);

  function handleClick(event) {
    event.preventDefault();
    setShowAdminOptions(!showAdminOptions)
  }

  function onEditSuccess(data) {
    // Replace the edited item in the list with updated values.
    const idx = contentList.findIndex(item => item.id === data.id);
    console.log('index', { idx, data, content: contentList });
    contentList[idx] = data;
    updateContent([...contentList]);
  }

  function onDeleteSuccess(id) {
    // Remove the deleted item from the list.
    const list = contentList.filter(item => item.id !== id);
    updateContent([...list]);
  }

  // Show the item with admin options.
  if (showAdminOptions) {
    return (
      <div class="card card--editing h-100">
        <div class="card-body">
          <h5 class="card-title">Editing:<span class="sr-only">{title}</span></h5>
          <NodeEdit
            id={id}
            title={title}
            body={body}
            onSuccess={onEditSuccess}
            setShowAdminOptions={setShowAdminOptions}
            showAdminOptions={showAdminOptions}
        />
        </div>

        <div class="card-footer d-flex justify-content-end text-muted">
            <button class="btn btn-outline-secondary btn-sm mr-1" onClick={handleClick}>
              discard changes
            </button>
            <NodeDelete
              id={id}
              title={title}
              onSuccess={onDeleteSuccess}
            />
        </div>


      </div>
    );
  }

  // Show just the item.
  return (
    <div class="card h-100">
      <div class="card-body">
        {title.length > 0 && <h5 class="card-title">{title}</h5>}
        <div class="card-text">{body.summary}</div>
        {cta_href &&
          <a href={`/node/${cta_href}`} class="btn btn-primary mt-3">{cta_text ? cta_text : 'Read more'}</a>
        }
      </div>
      <div class="card-footer d-flex justify-content-end text-muted">
        <button class="btn btn-outline-secondary btn-sm" onClick={handleClick}>
          edit
        </button>
      </div>
    </div>
  );
};

/**
 * Component to render when there are no pages to display.
 */
const NoData = () => (
  <div>No pages found.</div>
);

/**
 * Display a list of Drupal page nodes.
 *
 * Retrieves pages from Drupal's JSON:API and then displays them along with
 * admin features to create, update, and delete pages.
 */
const NodeReadWrite = () => {
  const [content, updateContent] = useState([]);
  const [filter, setFilter] = useState(null);
  const [showNodeAdd, setShowNodeAdd] = useState(false);

  useEffect(() => {
    // This should point to your local Drupal instance. Alternatively, for React
    // applications embedded in a Drupal theme or module this could also be set
    // to a relative path.
    const API_ROOT = '/jsonapi/';
    const url = `${API_ROOT}node/page?fields[node--page]=id,drupal_internal__nid,title,body&sort=-created&page[limit]=10`;

    const headers = new Headers({
      Accept: 'application/vnd.api+json',
    });

    fetch(url, { headers })
      .then((response) => response.json())
      .then((data) => {
        if (isValidData(data)) {
          // Initialize the list of content with data retrieved from Drupal.
          updateContent(data.data);
        }
      })
      .catch(err => console.log('There was an error accessing the API', err));
  }, []);

  // Handle updates to state when a node is added.
  function onNodeAddSuccess(data) {
    // Add the new item to the top of the list.
    content.unshift(data);
    // Note the use of [...content] here, this is because we're
    // computing new state based on previous state and need to use a
    // functional update. https://reactjs.org/docs/hooks-reference.html#functional-updates
    // [...content] syntax creates a new array with the values of
    // content, and updates the state to that new array.
    updateContent([...content]);
  }

  return (
    <div>
      {content.length ? (
        <>
          <p class="lead">POC for live editing entities through a decoupled react interface. To test, you must be logged into the site with editing privileges.</p>
          <div class="form-group d-flex my-5 align-items-center">
            <label htmlFor="filter" class="flex-shrink-0 font-weight-bold text-uppercase mb-0 d-flex align-items-center">Search:</label>
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
            // If there's a `filter` apply it to the list of nodes.
            content.filter((item) => {
              if (!filter) {
                return item;
              }

              if (filter && (item.attributes.title.toLowerCase().includes(filter) || item.attributes.body.value.toLowerCase().includes(filter))) {
                return item;
              }
            }).map((item) => (
              <div class="col-6 my-3">
                <NodeItem
                  key={item.id}
                  id={item.id}
                  updateContent={updateContent}
                  contentList={content}
                  cta_href={item.attributes.drupal_internal__nid}
                  cta_text='Full page'
                  {...item.attributes}
                />
              </div>
            ))
          }
          </div>
        </>
      ) : (
          <NoData />
        )}
      <hr />
      {/* @TODO: Add a page doesn't quite work - form needs to clear after success or modal close. */}
      {/* {showNodeAdd ? (
        <>
          <div class="d-flex justify-content-end">
            <button class="btn btn-secondary" onClick={() => setShowNodeAdd(false)}>Cancel</button>
          </div>
          <h3>Add a new page</h3>
          <NodeAdd
            onSuccess={onNodeAddSuccess}
            setShowNodeAdd={setShowNodeAdd}
            showNodeAdd={showNodeAdd}
          />
        </>
      ) : ( */}
        <>
          <div class="d-flex justify-content-end">
            {/* <button class="btn btn-success" onClick={() => setShowNodeAdd(true)}>Add a page</button> */}
            <button type="button" class="btn btn-success" onClick={() => setShowNodeAdd(true)} data-toggle="modal" data-target="#addNodeForm">
                    Add a page
            </button>
          </div>

        <div class="modal fade" id="addNodeForm" tabindex="-1" role="dialog" aria-hidden="true">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h3>Add a new basic page</h3>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <NodeAdd
                  onSuccess={onNodeAddSuccess}
                  setShowNodeAdd={setShowNodeAdd}
                  showNodeAdd={showNodeAdd}
                />      </div>
              {/* <div class="modal-footer">
              </div> */}
            </div>
          </div>
        </div>
        </>


        {/* )} */}
    </div>
  );
};

export default NodeReadWrite;

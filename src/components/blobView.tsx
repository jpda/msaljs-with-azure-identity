import React from 'react';
import { BlobServiceClient, BlobItem } from "@azure/storage-blob";

interface Props {
    fullSasUri: string;
}
interface State {
    blobsWeFound: BlobViewItem[];
    containerUrl: string;
    sasUri: string;
}

interface BlobViewItem {
    blob: BlobItem;
    url: string;
}

export class BlobView extends React.Component<Props, State> {
    state: State;

    constructor(props: Props, state: State) {
        super(props, state);
        this.state = { blobsWeFound: [], containerUrl: "", sasUri: props.fullSasUri }
    }

    componentWillRecieveProps(nextProps: Props) {
        this.setState({
            sasUri: nextProps.fullSasUri
        });
    }

    async componentDidMount() {
        //await this.fetchBlobs(this.state.sasUri);
        await this.fetchBlobs(this.state.sasUri);
    }

    async fetchBlobs(sasUri: string) {
        if (!sasUri && sasUri === "") return;
        var uri = new URL(sasUri);
        var host = `${uri.protocol}//${uri.host}`;
        var container = `${uri.pathname}`;
        var sas = uri.search;

        var containerName = container.split('/')[1];

        var localBlobList: BlobViewItem[] = [];
        const blobStorageClient = new BlobServiceClient(`${host}${sas}`);
        var containerClient = blobStorageClient.getContainerClient(containerName);
        for await (const blob of containerClient.listBlobsFlat()) {
            var bc = containerClient.getBlobClient(blob.name);
            localBlobList.push({ blob: blob, url: bc.url } as BlobViewItem);
        }
        this.setState({ blobsWeFound: localBlobList, containerUrl: containerClient.url });
    }

    render() {
        return (
            <div>
                <table className="table">
                    <thead>
                        <tr>
                            <th>blob name</th>
                            <th>blob size</th>
                            <th>download url</th>
                        </tr>
                    </thead>
                    <tbody>{
                        this.state.blobsWeFound.map((x, i) => {
                            return <tr key={i}>
                                <td>{x.blob.name}</td>
                                <td>{x.blob.properties.contentLength}</td>
                                <td><a href={x.url} download={x.blob.name}>Download</a></td>
                            </tr>
                        })
                    }
                    </tbody>
                </table>
            </div>
        )
    }
}
import React from 'react';
import { BlobServiceClient, BlobItem } from "@azure/storage-blob";
import { MsalTokenCredential } from '../MsalTokenCredential';
import AuthService from '../AuthService';

interface Props {
    authService: AuthService;
}
interface State {
    // a place to store our blob item metadata after we query them from the service
    blobsWeFound: BlobItem[];
    containerUrl: string;
}

export class BlobView extends React.Component<Props, State> {
    state: State;
    authService: AuthService;

    constructor(props: Props, state: State) {
        //super(state);
        super(props, state);
        this.authService = props.authService;
        this.state = { blobsWeFound: [], containerUrl: "" }
    }

    // here's our azure identity config
    async componentDidMount() {
        var localBlobList = [];
        const blobStorageClient = new BlobServiceClient(
            // this is the blob endpoint of your storage acccount. Available from the portal 
            // they follow this format: <accountname>.blob.core.windows.net for Azure global
            // the endpoints may be slightly different from national clouds like US Gov or Azure China
            "https://jpdamsaljsblob.blob.core.windows.net/",
            new MsalTokenCredential(this.authService)
        )

        // this uses our container we created earlier - I named mine "private"
        var containerClient = blobStorageClient.getContainerClient("private");

        // now let's query our container for some blobs!
        for await (const blob of containerClient.listBlobsFlat()) {
            // and plunk them in a local array...
            localBlobList.push(blob);
        }
        //...that we push into our state
        this.setState({ blobsWeFound: localBlobList, containerUrl: containerClient.url });
    }

    render() {
        return (
            <div>
                <table>
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
                                <td>{x.name}</td>
                                <td>{x.properties.contentLength}</td>
                                <td>
                                    <img alt={x.name} src={this.state.containerUrl + x.name} />
                                </td>
                            </tr>
                        })
                    }
                    </tbody>
                </table>
            </div>
        )
    }
}
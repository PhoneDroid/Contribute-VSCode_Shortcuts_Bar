
import { ExtensionContext , extensions , window , env , Uri } from 'vscode'
import { ExtensionId } from './Extension'

import Version from './Version'



interface ExtensionData {

    version ?: number [] ;
}


function storage ( context : ExtensionContext ){

    const data = context.globalState
        .get<any>(ExtensionId,{})

    if( typeof data === 'string' )
        return {}

    return data as ExtensionData
}

function store ( context : ExtensionContext , update : Function ){

    let data = storage(context);

    update(data);

    context.globalState
        .update(ExtensionId,data);
}

function knownVersion ( context : ExtensionContext ){

    const { version } = storage(context);

    return new Version(version)
}

function pack (){
    return extensions
        .getExtension(ExtensionId)
        ?.packageJSON
}

function version (){

    const { version } = pack() ?? {};

    return Version
        .from(version);
}


const { showInformationMessage } = window;

export function checkForUpdates ( context : ExtensionContext ){

    const
        known = knownVersion(context) ,
        pack = version() ;

    store(context,
        ( data ) => data.version = pack);


    if( pack.isBugFix(known) )
        return

    showUpdateMessage();
}


async function showUpdateMessage (){

    const { string } = version();

    const message =
        `Shortcut Menubar v${ string } - Add your own buttons!`;

    const tutorial = { title : 'See how' };

    const actions = [ tutorial ];

    const action = await
        showInformationMessage(message, ... actions );

    switch ( action ){
    case tutorial : openTutorial() ;
    }
}


const Link_Tutorial =  Uri
    .parse(`https://github.com/GorvGoyl/Shortcut-Menu-Bar-VSCode-Extension#create-buttons-with-custom-commands`);

async function openTutorial (){
    await env.openExternal(Link_Tutorial);
}

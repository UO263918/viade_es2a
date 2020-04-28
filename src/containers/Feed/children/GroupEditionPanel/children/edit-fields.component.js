import React, { useState, useEffect } from 'react';

import { EditFieldsWrapper, EditFieldsFriends, MemberLine } from './edit-fields.style';
import { InputCard, Button } from '../../FeedAdditionPanel/feed-addition-panel.style'

import { useTranslation } from 'react-i18next';

import { friendService, userService } from "@services";

const EditFields = ({ onEdit, onAddMembers, onError, onSuccess, webId, selectedGroup, onDeleteMembers }) => {

    const { t } = useTranslation();

    const [name, setName] = useState();
    const [newMember, setNewMember] = useState('');
    const [oldMembers, setOldMembers] = useState(new Set(selectedGroup.members));
    const [friends, setFriends] = useState([]);
    const [selectedFriends, setSelectedFriends] = useState(new Set());
    const [nameChanged, setNameChanged] = useState(false);

    const onSaveButton = async () => {
        if (nameChanged)
            onEdit(name);
        else
            onEdit(selectedGroup.name);
    };

    const onAddButton = () => {
        if (newMember) {
            onAddMembers([newMember]);
            onSuccess();
        } else
            onError(t('groupcreation.no_member'));
    }

    const onDeleteButton = async () => {
        await onDeleteMembers([...oldMembers]);
    }

    const onSaveMultiple = async () => {
        await onAddMembers([...selectedFriends]);
        onSuccess();
    }

    const onFriendSelect = f => {
        if (selectedFriends.has(f)) selectedFriends.delete(f);
        else selectedFriends.add(f);

        setSelectedFriends(new Set(selectedFriends));
    };

    const onCheckbox = f => {
        if (oldMembers.has(f))
            oldMembers.delete(f);
        else
            oldMembers.add(f);

        console.log(oldMembers);
        setOldMembers(new Set(oldMembers));
    }

    useEffect(() => {
        (async () => setFriends(await Promise.all((await friendService.findValidFriends(webId)).map(async f => {
            return await userService.getProfile(f);
        }))))();
    }, [webId]);

    return <EditFieldsWrapper>
        <InputCard>
            <input
                type='text'
                value={name}
                onChange={e => { setName(e.target.value); setNameChanged(true); }}
                placeholder={selectedGroup.name} />
        </InputCard>

        <EditFieldsFriends style={{ maxHeight: "50%" }}>
            <span className="share-title">{t('groupeditor.members')}</span>
            <div style={{ overflowY: "auto" }}>
                <table>
                    <tbody>
                        {selectedGroup.members ?
                            selectedGroup.members.map((member, i) => {
                                console.log(member)
                                return <MemberLine key={i}>
                                            {member} <input id={"checkbox" + i} type="checkbox" onClick={() => onCheckbox(member) }/>
                                        </MemberLine>
                            }) : 'null'}
                    </tbody>
                </table>
            </div>
            <Button style={{ margin: "1em 0 0" }} onClick={() => onDeleteButton()}>
                {"Delete"}
            </Button>
        </EditFieldsFriends>

        <EditFieldsFriends style={{ maxHeight: "50%" }}>
            <span className="share-title">{t('groupcreator.friends')}</span>
            <div style={{ overflowY: "auto" }}>
                <table>
                    <tbody>
                        {friends && friends.length ? (
                            friends.map(({ name, image, webId }) => (<tr
                                key={webId}
                                className={selectedFriends.has(webId) ? "selected" : ""}
                                onClick={() => onFriendSelect(webId)}
                            >
                                <td>
                                    <img src={image} alt={'profile'} />
                                    <span>{name}</span>
                                </td>
                            </tr>
                            ))
                        ) : (
                                <span className="no-friends">{t("feed.no_friends")}</span>
                            )}
                    </tbody>
                </table>
            </div>
            <Button style={{ margin: "1em 0 0" }} onClick={() => onSaveMultiple(selectedFriends)}>
                {t('groupcreation.add_button')}
            </Button>
        </EditFieldsFriends>

        <InputCard>
            <input
                type='text'
                value={newMember}
                onChange={e => setNewMember(e.target.value)}
                placeholder={t('groupcreation.add_member')} />

            <Button onClick={onAddButton}>{t('groupcreation.add_button')}</Button>
        </InputCard>

        <InputCard>
            <Button style={{ width: '100%' }} onClick={onSaveButton}>{t('groupeditor.save')}</Button>
        </InputCard>
    </EditFieldsWrapper>;
};

export default EditFields;